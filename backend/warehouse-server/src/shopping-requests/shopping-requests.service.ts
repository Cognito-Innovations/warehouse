import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ShoppingRequest,
  ShoppingRequestStatus,
} from './shopping-request.entity';
import { CreateShoppingRequestDto } from './dto/create-shopping-request.dto';
import { ShoppingRequestResponseDto } from './dto/shopping-request-response.dto';
import { Product } from 'src/products/product.entity';
import { FeatureType } from 'src/tracking-requests/tracking-request.entity';
import { DocumentsService } from 'src/documents/documents.service';
import { TrackingRequestsService } from 'src/tracking-requests/tracking-requests.service';
import { mapToTrackingStatus } from './status-mapper';
import { Country } from 'src/Countries/country.entity';
import { InvoicesService } from 'src/invoice/invoices.service';
import { Invoice, InvoiceStatus } from 'src/invoice/invoice.entity';

@Injectable()
export class ShoppingRequestsService {
  constructor(
    @InjectRepository(ShoppingRequest)
    private readonly shoppingRequestRepository: Repository<ShoppingRequest>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    private readonly documentsService: DocumentsService,
    private readonly trackingRequestsService: TrackingRequestsService,
    private readonly invoicesService: InvoicesService,
  ) {}

  async createShoppingRequest(
    createShoppingRequestDto: CreateShoppingRequestDto,
  ): Promise<ShoppingRequestResponseDto> {
    const country = await this.countryRepository.findOne({
      where: { name: createShoppingRequestDto.country },
    });

    if (!country) {
      throw new NotFoundException(
        `Country ${createShoppingRequestDto.country} not found`,
      );
    }

    const shoppingRequest = this.shoppingRequestRepository.create({
      ...createShoppingRequestDto,
      country,
      status:
        createShoppingRequestDto.status || ShoppingRequestStatus.REQUESTED,
      items: createShoppingRequestDto.items || 0,
    });

    const savedShoppingRequest =
      await this.shoppingRequestRepository.save(shoppingRequest);

    await this.trackingRequestsService.createTrackingRequest({
      feature_type: FeatureType.ShoppingRequest,
      feature_fid: savedShoppingRequest.id,
      status: mapToTrackingStatus(savedShoppingRequest.status),
      user: savedShoppingRequest.user_id,
      country_id: savedShoppingRequest.country.id,
    });

    return {
      id: savedShoppingRequest.id,
      user_id: savedShoppingRequest.user_id,
      request_code: savedShoppingRequest.request_code,
      country: savedShoppingRequest.country.name,
      items: savedShoppingRequest.items,
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
      relations: ['user'],
    });

    return Promise.all(
      shoppingRequests.map(async (request) => {
        const slips = await this.documentsService.findByFeature(
          FeatureType.ShoppingRequest,
          request.id,
        );

        const trackingRequests =
          await this.trackingRequestsService.getTrackingRequestsByFeature(
            FeatureType.ShoppingRequest,
            request.id,
          );

        return {
          id: request.id,
          user_id: request.user_id,
          user: request.user
            ? {
                id: request.user.id,
                email: request.user.email,
                name: request.user.name,
                image: request.user.image,
                suite_no: request.user.suite_no,
                verified: request.user.verified,
              }
            : undefined,
          request_code: request.request_code,
          country: request.country.name,
          items: request.items,
          remarks: request.remarks,
          status: request.status,
          payment_slips: slips,
          tracking_requests: trackingRequests,
          created_at: request.created_at,
          updated_at: request.updated_at,
        };
      }),
    );
  }

  async getShoppingRequestsByUser(
    userId: string,
  ): Promise<ShoppingRequestResponseDto[]> {
    const shoppingRequests = await this.shoppingRequestRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });

    return Promise.all(
      shoppingRequests.map(async (request) => {
        const slips = await this.documentsService.findByFeature(
          FeatureType.ShoppingRequest,
          request.id,
        );

        const trackingRequests =
          await this.trackingRequestsService.getTrackingRequestsByFeature(
            FeatureType.ShoppingRequest,
            request.id,
          );

        return {
          id: request.id,
          user_id: request.user_id,
          request_code: request.request_code,
          country: request.country.name,
          items: request.items,
          remarks: request.remarks,
          status: request.status,
          payment_slips: slips,
          tracking_requests: trackingRequests,
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
      relations: ['user'],
    });

    if (!shoppingRequest) {
      throw new NotFoundException(
        `Shopping request with code ${requestCode} not found`,
      );
    }

    const shoppingRequestProducts = await this.productRepository.find({
      where: { shopping_request_id: shoppingRequest.id },
    });

    const slips = await this.documentsService.findByFeature(
      FeatureType.ShoppingRequest,
      shoppingRequest.id,
    );

    const trackingRequests =
      await this.trackingRequestsService.getTrackingRequestsByFeature(
        FeatureType.ShoppingRequest,
        shoppingRequest.id,
      );

    const invoice = await this.invoicesService.getInvoiceByShoppingRequestId(
      shoppingRequest.id,
    );

    return {
      id: shoppingRequest.id,
      user_id: shoppingRequest.user_id,
      user: shoppingRequest.user
        ? {
            id: shoppingRequest.user.id,
            email: shoppingRequest.user.email,
            name: shoppingRequest.user.name,
            image: shoppingRequest.user.image,
            suite_no: shoppingRequest.user.suite_no,
            verified: shoppingRequest.user.verified,
          }
        : undefined,
      request_code: shoppingRequest.request_code,
      country: shoppingRequest.country.name,
      items: shoppingRequest.items,
      shopping_request_products: shoppingRequestProducts,
      remarks: shoppingRequest.remarks,
      status: shoppingRequest.status,
      payment_slips: slips,
      tracking_requests: trackingRequests,
      invoice: invoice
        ? {
            id: invoice.id,
            invoice_no: invoice.invoice_no,
            amount: invoice.amount,
            gst: invoice.gst,
            total: invoice.total,
            status: invoice.status,
            products: invoice.products,
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
      country_id: updatedShoppingRequest.country.id,
    });

    const slips = await this.documentsService.findByFeature(
      FeatureType.ShoppingRequest,
      updatedShoppingRequest.id,
    );

    const trackingRequests =
      await this.trackingRequestsService.getTrackingRequestsByFeature(
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
      country: updatedShoppingRequest.country.name,
      items: updatedShoppingRequest.items,
      remarks: updatedShoppingRequest.remarks,
      status: updatedShoppingRequest.status,
      payment_slips: slips,
      tracking_requests: trackingRequests,
      invoice: invoice
        ? {
            id: invoice.id,
            invoice_no: invoice.invoice_no,
            amount: invoice.amount,
            gst: invoice.gst,
            total: invoice.total,
            status: invoice.status,
            products: invoice.products,
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
