import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import {
  ShoppingRequest,
  ShoppingRequestStatus,
} from './shopping-request.entity';
import { CreateShoppingRequestDto } from './dto/create-shopping-request.dto';
import { ShoppingRequestResponseDto } from './dto/shopping-request-response.dto';
import { ShoppingRequestProduct } from 'src/products/shopping-request-product.entity';
import { FeatureType } from 'src/tracking-requests/tracking-request.entity';
import { DocumentsService } from 'src/documents/documents.service';
import { TrackingRequestsService } from 'src/tracking-requests/tracking-requests.service';
import { mapToTrackingStatus } from './status-mapper';
import { CourierCompany } from 'src/courier_companies/courier_company.entity';
import { InvoicesService } from 'src/invoice/invoices.service';
import { Invoice, InvoiceStatus } from 'src/invoice/entities/invoice.entity';
import { UserPreferencesService } from 'src/user-preferences/user-preferences.service';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/user.entity';
import {
  getShoppingRequestEmailTemplate,
  ShoppingRequestEmailType,
} from './shopping-request-email-templates';

@Injectable()
export class ShoppingRequestsService {
  constructor(
    @InjectRepository(ShoppingRequest)
    private readonly shoppingRequestRepository: Repository<ShoppingRequest>,
    @InjectRepository(ShoppingRequestProduct)
    private readonly productRepository: Repository<ShoppingRequestProduct>,
    @InjectRepository(CourierCompany)
    private readonly courierRepository: Repository<CourierCompany>,
    private readonly documentsService: DocumentsService,
    private readonly trackingRequestsService: TrackingRequestsService,
    private readonly invoicesService: InvoicesService,
    private readonly userPreferencesService: UserPreferencesService,
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
  ) {}

  private buildShoppingRequestQB(
    countryId?: string,
  ): SelectQueryBuilder<ShoppingRequest> {
    const qb = this.shoppingRequestRepository
      .createQueryBuilder('shoppingRequest')
      .leftJoinAndSelect('shoppingRequest.courier', 'courier')
      .leftJoinAndSelect('courier.country', 'country');

    if (countryId) {
      qb.andWhere('country.id = :countryId', { countryId });
    }

    return qb;
  }

  async getShoppingRequestsCountByStatus(
    status: ShoppingRequestStatus,
    countryId?: string,
  ): Promise<number> {
    const qb = this.buildShoppingRequestQB(countryId);

    qb.andWhere('shoppingRequest.status = :status', { status });

    return qb.getCount();
  }

  private generateRequestCode(courier: CourierCompany): string {
    const countryCode = courier.country.code;
    return `SR/${countryCode}/${Date.now()}`;
  }

  async createShoppingRequest(
    createShoppingRequestDto: CreateShoppingRequestDto,
  ): Promise<ShoppingRequestResponseDto> {
    const { user_id, items_count = 0, remarks } = createShoppingRequestDto;

    const user = await this.usersService.findById(user_id);
    if (!user) {
      throw new NotFoundException(`User ${user_id} not found`);
    }

    if (!user.preference || !user.preference.courier) {
      throw new NotFoundException('Courier not found in user preferences');
    }

    const courier = user.preference.courier;

    const request_code = this.generateRequestCode(courier);

    const shoppingRequest = this.shoppingRequestRepository.create({
      user_id,
      courier,
      request_code,
      items_count,
      remarks,
      status: ShoppingRequestStatus.REQUESTED,
    });
    const savedShoppingRequest =
      await this.shoppingRequestRepository.save(shoppingRequest);
    await this.trackingRequestsService.createTrackingRequest({
      feature_type: FeatureType.ShoppingRequest,
      feature_fid: savedShoppingRequest.id,
      status: mapToTrackingStatus(savedShoppingRequest.status),
      user: savedShoppingRequest.user_id,
      courier_id: savedShoppingRequest.courier.id,
    });

    await this.sendEmailToUser(savedShoppingRequest, 'request-created');

    const { courier: savedCourier, ...rest } = savedShoppingRequest;
    return {
      ...rest,
      courier: savedCourier.name,
      status: savedShoppingRequest.status,
      payment_slips: [],
    };
  }

  async getAllShoppingRequests({
    userId,
    page,
    limit,
    origin,
    target,
    status,
  }: {
    userId: string;
    page: number;
    limit: number;
    origin?: string;
    target?: string;
    status?: string | string[];
  }) {
    const qb = this.shoppingRequestRepository
      .createQueryBuilder('sr')
      .leftJoinAndSelect('sr.user', 'user')
      .leftJoin('user.address', 'address')
      .leftJoinAndSelect('sr.courier', 'courier')
      .leftJoin('courier.country', 'country')
      .innerJoin(
        'user_preferences',
        'up',
        'up.user_id = :userId AND up.courier_id = courier.id',
        { userId },
      )
      .orderBy('sr.created_at', 'DESC');

    if (origin) {
      qb.andWhere('address.country = :origin', { origin });
    }

    if (target) {
      qb.andWhere('country.code = :target', { target });
    }

    if (status) {
      const statuses = Array.isArray(status) ? status : [status];
      qb.andWhere('sr.status IN (:...statuses)', { statuses });
    }

    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getShoppingRequestsByUser(
    userId: string,
  ): Promise<ShoppingRequestResponseDto[]> {
    const shoppingRequests = await this.shoppingRequestRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      relations: ['courier'],
    });

    return Promise.all(
      shoppingRequests.map(async (request) => {
        const slips = await this.documentsService.findByFeature(
          FeatureType.ShoppingRequest,
          request.id,
        );

        const rawProducts = await this.productRepository.find({
          where: { shopping_request_id: request.id },
        });

        const shoppingRequestProducts = await Promise.all(
          rawProducts.map(async (product) => ({
            ...product,
            unit_price:
              await this.userPreferencesService.getFormattedConvertedPrice(
                request.user_id,
                product.unit_price,
              ),
          })),
        );

        return {
          ...request,
          courier: request.courier?.name,
          payment_slips: slips,
          shopping_request_products: shoppingRequestProducts,
        } as ShoppingRequestResponseDto;
      }),
    );
  }

  async getShoppingRequestByCode(
    requestCode: string,
  ): Promise<ShoppingRequestResponseDto> {
    const shoppingRequest = await this.shoppingRequestRepository.findOne({
      where: { request_code: requestCode },
      relations: ['user', 'user.address', 'courier', 'courier.country'],
    });

    if (!shoppingRequest) {
      throw new NotFoundException(
        `Shopping request with code ${requestCode} not found`,
      );
    }

    const [
      shoppingRequestProductsResult,
      slipsResult,
      invoiceResult,
      trackingRequestsResult,
      userCurrencyResult,
    ] = await Promise.allSettled([
      this.productRepository.find({
        where: { shopping_request_id: shoppingRequest.id },
      }),
      this.documentsService.findByFeature(
        FeatureType.ShoppingRequest,
        shoppingRequest.id,
      ),
      this.invoicesService.getInvoiceByShoppingRequestId(shoppingRequest.id),
      this.trackingRequestsService.getTrackingRequestsByFeature(
        FeatureType.ShoppingRequest,
        shoppingRequest.id,
      ),
      this.userPreferencesService.getUserCurrency(shoppingRequest.user_id),
    ]);

    const shoppingRequestProducts =
      shoppingRequestProductsResult.status === 'fulfilled'
        ? shoppingRequestProductsResult.value
        : [];
    const slips = slipsResult.status === 'fulfilled' ? slipsResult.value : [];
    const invoice =
      invoiceResult.status === 'fulfilled' ? invoiceResult.value : null;
    const trackingRequests =
      trackingRequestsResult.status === 'fulfilled'
        ? trackingRequestsResult.value
        : [];
    const userCurrency =
      userCurrencyResult.status === 'fulfilled'
        ? userCurrencyResult.value
        : 'USD';

    const convertPrice = async (price: number | null | undefined) => {
      if (price === null || price === undefined) return price;
      return this.userPreferencesService.getConvertedPrice(
        shoppingRequest.user_id,
        price,
      );
    };

    const formatPrice = async (price: number | null | undefined) => {
      if (price === null || price === undefined) return price;
      return this.userPreferencesService.getFormattedConvertedPrice(
        shoppingRequest.user_id,
        price,
      );
    };

    const { user, courier, ...rest } = shoppingRequest;

    return {
      ...rest,
      user: user ? user : undefined,
      courier: courier?.name,
      courier_country_code: courier?.country?.code,
      shopping_request_products: await Promise.all(
        shoppingRequestProducts.map(async (product) => ({
          ...product,
          unit_price: await convertPrice(product.unit_price),
          currency: userCurrency,
        })),
      ),
      payment_slips: slips,
      tracking_requests: trackingRequests,
      invoice: invoice
        ? {
            ...invoice,
            amount: (await formatPrice(invoice.amount)) ?? '',
            total: (await formatPrice(invoice.total)) ?? '',
            products: await Promise.all(
              (invoice.products ?? []).map(async (product) => ({
                ...product,
                invoice: undefined,
                unit_price: (await formatPrice(product.unit_price)) ?? '',
                currency: userCurrency,
              })),
            ),
          }
        : undefined,
    };
  }

  async getOriginOptions(): Promise<string[]> {
    try {
      const originRows = await this.shoppingRequestRepository
        .createQueryBuilder('sr')
        .innerJoin('sr.user', 'user')
        .innerJoin('user.address', 'address')
        .select('DISTINCT address.country', 'country')
        .getRawMany<{ country: string }>();

      return originRows.map((row) => row.country);
    } catch (error) {
      console.error('Failed to fetch origin options:', error);
      throw new InternalServerErrorException('Unable to fetch origin options');
    }
  }

  async getTargetOptions(userId: string): Promise<string[]> {
    try {
      const targetRows = await this.shoppingRequestRepository
        .createQueryBuilder('sr')
        .innerJoin('sr.courier', 'courier')
        .innerJoin('user_preferences', 'up', 'up.courier_id = courier.id')
        .innerJoin('countries', 'country', 'country.id = courier.country_id')
        .where('up.user_id = :userId', { userId })
        .select('DISTINCT country.code', 'code')
        .getRawMany<{ code: string }>();

      return targetRows.map((row) => row.code);
    } catch (error) {
      console.error('Failed to fetch target options:', error);
      throw new InternalServerErrorException('Unable to fetch target options');
    }
  }

  async updateStatus(
    id: string,
    status: ShoppingRequestStatus,
  ): Promise<ShoppingRequestResponseDto> {
    const shoppingRequest = await this.shoppingRequestRepository.findOne({
      where: { id },
    });

    if (!shoppingRequest) {
      throw new NotFoundException(`Shopping request with id ${id} not found`);
    }

    const normalizedStatus =
      status.toUpperCase() as keyof typeof ShoppingRequestStatus;

    if (!(normalizedStatus in ShoppingRequestStatus)) {
      throw new Error(`Invalid status: ${status}`);
    }

    let invoice: Invoice | null = null;
    if (normalizedStatus === 'QUOTATION_READY') {
      invoice = await this.invoicesService.createInvoice(shoppingRequest);
      (shoppingRequest as any).invoice = invoice;
    }

    shoppingRequest.status = ShoppingRequestStatus[normalizedStatus];

    const updatedShoppingRequest =
      await this.shoppingRequestRepository.save(shoppingRequest);

    if (normalizedStatus === 'PAYMENT_APPROVED') {
      invoice = await this.invoicesService.getInvoiceByShoppingRequestId(id);
      if (invoice) {
        invoice.status = InvoiceStatus.PAID;
        await this.invoicesService.updateInvoice(invoice);
      }
    }

    await this.trackingRequestsService.createTrackingRequest({
      feature_type: FeatureType.ShoppingRequest,
      feature_fid: id,
      status: mapToTrackingStatus(updatedShoppingRequest.status),
      user: updatedShoppingRequest.user_id,
      courier_id: updatedShoppingRequest.courier.id,
    });

    let emailType: ShoppingRequestEmailType = 'status-updated';
    if (normalizedStatus === 'QUOTATION_READY') {
      emailType = 'quotation-ready';
    } else if (normalizedStatus === 'PAYMENT_APPROVED') {
      emailType = 'payment-approved';
    }

    await this.sendEmailToUser(
      updatedShoppingRequest,
      emailType,
      ShoppingRequestStatus[normalizedStatus],
    );

    const slips = await this.documentsService.findByFeature(
      FeatureType.ShoppingRequest,
      updatedShoppingRequest.id,
    );

    if (!invoice) {
      invoice = await this.invoicesService.getInvoiceByShoppingRequestId(
        updatedShoppingRequest.id,
      );
    }

    const { user_id, courier, ...rest } = updatedShoppingRequest;

    return {
      ...rest,
      user_id,
      courier: courier?.name,
      payment_slips: slips,
      invoice: invoice
        ? {
            ...invoice,
            amount:
              await this.userPreferencesService.getFormattedConvertedPrice(
                updatedShoppingRequest.user_id,
                invoice.amount,
              ),
            total: await this.userPreferencesService.getFormattedConvertedPrice(
              updatedShoppingRequest.user_id,
              invoice.total,
            ),
            products: await Promise.all(
              (invoice.products ?? []).map(async (product) => ({
                ...product,
                invoice: undefined,
                unit_price:
                  await this.userPreferencesService.getFormattedConvertedPrice(
                    updatedShoppingRequest.user_id,
                    product.unit_price,
                  ),
              })),
            ),
          }
        : undefined,
    };
  }

  async addPaymentSlip(
    shoppingRequestId: string,
    dto: {
      url: string;
      original_filename: string;
      document_type?: string;
      file_size?: number;
      mime_type?: string;
    },
    userId: string,
  ): Promise<ShoppingRequestResponseDto> {
    await this.documentsService.create({
      uploaded_by: userId,
      feature_type: FeatureType.ShoppingRequest,
      feature_fid: shoppingRequestId,
      document_name: 'Payment Slip',
      original_filename: dto.original_filename,
      document_url: dto.url,
      document_type: dto.document_type || 'slip',
      file_size: dto.file_size,
      mime_type: dto.mime_type,
      category: 'PAYMENT',
      is_required: false,
    });

    return this.getShoppingRequestByCode(
      (
        await this.shoppingRequestRepository.findOneOrFail({
          where: { id: shoppingRequestId },
        })
      ).request_code,
    );
  }

  async deleteShoppingRequest(id: string): Promise<{ message: string }> {
    const shoppingRequest = await this.shoppingRequestRepository.findOne({
      where: { id },
    });

    if (!shoppingRequest) {
      throw new NotFoundException(`Shopping request with id ${id} not found`);
    }

    await this.productRepository.delete({ shopping_request_id: id });

    await this.shoppingRequestRepository.delete(id);

    return { message: 'Shopping request deleted successfully' };
  }

  private async sendEmailToUser(
    request: ShoppingRequest,
    type: ShoppingRequestEmailType,
    status?: ShoppingRequestStatus,
  ): Promise<void> {
    try {
      const user: User | null = await this.usersService.findById(
        request.user_id,
      );
      if (!user || !user.email) {
        return;
      }

      const { subject, html } = getShoppingRequestEmailTemplate(
        type,
        user,
        request,
        status,
      );

      await this.mailerService.sendMail({
        to: user.email,
        subject,
        html,
      });
    } catch (error) {
      console.error('[Email Error]', {
        requestId: request.id,
        type,
        error: error?.message,
      });
    }
  }
}
