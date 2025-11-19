import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  ) {}

  async createShoppingRequest(
    createShoppingRequestDto: CreateShoppingRequestDto,
  ): Promise<ShoppingRequestResponseDto> {
    const courier = await this.courierRepository.findOne({
      where: { id: createShoppingRequestDto.courier_id },
    });
    if (!courier) {
      throw new NotFoundException(
        `Courier ${createShoppingRequestDto.courier_id} not found`,
      );
    }
    const shoppingRequest = this.shoppingRequestRepository.create({
      ...createShoppingRequestDto,
      courier,
      status:
        createShoppingRequestDto.status || ShoppingRequestStatus.REQUESTED,
      items_count: createShoppingRequestDto.items_count || 0,
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

    const { courier: savedCourier, ...rest } = savedShoppingRequest;
    return {
      ...rest,
      courier: savedCourier.name,
      status: savedShoppingRequest.status,
      payment_slips: [],
    };
  }

  async getAllShoppingRequests() {
    const shoppingRequests = await this.shoppingRequestRepository.find({
      order: { created_at: 'DESC' },
      relations: ['user', 'courier'],
    });

    return shoppingRequests;
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
          }))
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
      relations: ['user', 'courier'],
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
      user: user
        ? this.usersService.mapToUserResponseDto(shoppingRequest.user)
        : undefined,
      courier: courier?.name,
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
}
