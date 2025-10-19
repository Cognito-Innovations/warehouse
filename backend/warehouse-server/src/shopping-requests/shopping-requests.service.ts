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
import { Invoice, InvoiceStatus } from 'src/invoice/invoice.entity';
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
    return {
      id: savedShoppingRequest.id,
      user_id: savedShoppingRequest.user_id,
      request_code: savedShoppingRequest.request_code,
      courier: savedShoppingRequest.courier.name,
      items_count: savedShoppingRequest.items_count,
      remarks: savedShoppingRequest.remarks,
      status: savedShoppingRequest.status,
      payment_slips: [],
      created_at: savedShoppingRequest.created_at,
      updated_at: savedShoppingRequest.updated_at,
    };
  }

  async getAllShoppingRequests(): Promise<ShoppingRequestResponseDto[]> {
    const shoppingRequests = await this.shoppingRequestRepository.find({
      order: { created_at: 'DESC' },
      relations: ['user', 'courier'],
    });

    return shoppingRequests.map((request) => ({
      id: request.id,
      user_id: request.user_id,
      user: request.user
        ? this.usersService.mapToUserResponseDto(request.user)
        : undefined,
      request_code: request.request_code,
      courier: request.courier.name,
      items_count: request.items_count,
      remarks: request.remarks,
      status: request.status,
      created_at: request.created_at,
      updated_at: request.updated_at,
    }));
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
            id: product.id,
            shopping_request_id: product.shopping_request_id,
            name: product.name,
            description: product.description,
            unit_price:
              await this.userPreferencesService.getFormattedConvertedPrice(
                request.user_id,
                product.unit_price,
              ),
            currency: product.currency,
            quantity: product.quantity,
            url: product.url,
            size: product.size,
            color: product.color,
            variants: product.variants,
            if_not_available_quantity: product.if_not_available_quantity,
            if_not_available_color: product.if_not_available_color,
            available: product.available,
            created_at: product.created_at,
            updated_at: product.updated_at,
          })),
        );

        return {
          id: request.id,
          user_id: request.user_id,
          request_code: request.request_code,
          courier: request.courier?.name,
          items_count: request.items_count,
          remarks: request.remarks,
          status: request.status,
          payment_slips: slips,
          shopping_request_products: shoppingRequestProducts,
          created_at: request.created_at,
          updated_at: request.updated_at,
        };
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

    return {
      id: shoppingRequest.id,
      user_id: shoppingRequest.user_id,
      user: shoppingRequest.user
        ? this.usersService.mapToUserResponseDto(shoppingRequest.user)
        : undefined,
      request_code: shoppingRequest.request_code,
      courier: shoppingRequest.courier?.name,
      items_count: shoppingRequest.items_count,
      shopping_request_products: await Promise.all(
        shoppingRequestProducts.map(async (product) => ({
          ...product,
          unit_price: await convertPrice(product.unit_price),
          currency: userCurrency,
        })),
      ),
      remarks: shoppingRequest.remarks,
      status: shoppingRequest.status,
      payment_slips: slips,
      tracking_requests: trackingRequests,
      invoice: invoice
        ? {
            id: invoice.id,
            invoice_no: invoice.invoice_no,
            amount: (await formatPrice(invoice.amount)) ?? '',
            total: (await formatPrice(invoice.total)) ?? '',
            status: invoice.status,
            products: await Promise.all(
              (invoice.products ?? []).map(async (product) => ({
                ...product,
                unit_price: (await formatPrice(product.unit_price)) ?? '',
                currency: userCurrency,
              })),
            ),
            created_at: invoice.created_at,
            updated_at: invoice.updated_at,
          }
        : undefined,
      created_at: shoppingRequest.created_at,
      updated_at: shoppingRequest.updated_at,
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

    return {
      id: updatedShoppingRequest.id,
      user_id: updatedShoppingRequest.user_id,
      request_code: updatedShoppingRequest.request_code,
      courier: updatedShoppingRequest.courier.name,
      items_count: updatedShoppingRequest.items_count,
      remarks: updatedShoppingRequest.remarks,
      status: updatedShoppingRequest.status,
      payment_slips: slips,
      tracking_requests: updatedShoppingRequest.tracking_requests,
      invoice: invoice
        ? {
            id: invoice.id,
            invoice_no: invoice.invoice_no,
            amount:
              await this.userPreferencesService.getFormattedConvertedPrice(
                updatedShoppingRequest.user_id,
                invoice.amount,
              ),
            total: await this.userPreferencesService.getFormattedConvertedPrice(
              updatedShoppingRequest.user_id,
              invoice.total,
            ),
            status: invoice.status,
            products: await Promise.all(
              (invoice.products ?? []).map(async (product) => ({
                id: product.id,
                shopping_request_id: product.shopping_request_id,
                name: product.name,
                description: product.description,
                unit_price:
                  await this.userPreferencesService.getFormattedConvertedPrice(
                    updatedShoppingRequest.user_id,
                    product.unit_price,
                  ),
                currency: product.currency,
                quantity: product.quantity,
                url: product.url,
                size: product.size,
                color: product.color,
                variants: product.variants,
                if_not_available_quantity: product.if_not_available_quantity,
                if_not_available_color: product.if_not_available_color,
                available: product.available,
                created_at: product.created_at,
                updated_at: product.updated_at,
              })),
            ),
            created_at: invoice.created_at,
            updated_at: invoice.updated_at,
          }
        : undefined,
      created_at: updatedShoppingRequest.created_at,
      updated_at: updatedShoppingRequest.updated_at,
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
