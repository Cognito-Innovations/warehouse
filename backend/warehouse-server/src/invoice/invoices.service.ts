import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice, InvoiceStatus } from './entities/invoice.entity';
import { ShoppingRequest } from 'src/shopping-requests/shopping-request.entity';
import { ShoppingRequestProduct } from 'src/products/shopping-request-product.entity';
import { Shipment } from 'src/shipments/shipment.entity';
import { Package } from 'src/packages/entities';
import { ChargeDto } from 'src/shipments/dto/create-shipment-invoice.dto';
import { InvoiceCharge } from './entities/invoice-charge.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(ShoppingRequestProduct)
    private readonly productRepository: Repository<ShoppingRequestProduct>,
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
    @InjectRepository(InvoiceCharge)
    private readonly invoiceChargeRepository: Repository<InvoiceCharge>,
  ) {}

  private generateInvoiceNo(
    countryCode: string,
    year: number,
    counter: number,
  ): string {
    return `INV/${countryCode}/${year}/${counter}`;
  }

  async createInvoice(shoppingRequest: ShoppingRequest): Promise<Invoice> {
    const products = await this.productRepository.find({
      where: { shopping_request_id: shoppingRequest.id },
    });

    const amount = products.reduce(
      (sum, p) => sum + (Number(p.unit_price) || 0) * (p.quantity || 0),
      0,
    );

    const COMMISSION_RATE = 0.08;

    const commission = amount * COMMISSION_RATE;
    const total = amount + commission;

    const counter = await this.invoiceRepository.count();
    const invoiceNo = this.generateInvoiceNo(
      shoppingRequest.courier.country.code || 'XX',
      new Date().getFullYear(),
      counter + 1,
    );

    const invoice = this.invoiceRepository.create({
      invoice_no: invoiceNo,
      amount,
      total,
      status: InvoiceStatus.UNPAID,
      shopping_request: shoppingRequest,
    });

    const savedInvoice = await this.invoiceRepository.save(invoice);

    for (const product of products) {
      product.invoice = savedInvoice;
    }
    await this.productRepository.save(products);

    savedInvoice.products = products;
    return savedInvoice;
  }

  async getInvoiceByShoppingRequestId(
    requestId: string,
  ): Promise<Invoice | null> {
    return this.invoiceRepository.findOne({
      where: { shopping_request: { id: requestId } },
      relations: ['products'],
    });
  }

  async createShipmentInvoice(payload: {
    shipment: Shipment,
    charges: ChargeDto[];
    total: number;
  }): Promise<Invoice> {
    const { shipment, charges, total } = payload;

    const counter = await this.invoiceRepository.count();
    const invoiceNo = this.generateInvoiceNo(
      shipment.country.code || 'XX',
      new Date().getFullYear(),
      counter + 1,
    );

    const invoice = this.invoiceRepository.create({
      invoice_no: invoiceNo,
      amount: total,
      total,
      status: InvoiceStatus.UNPAID,
      shipment,
    })
    const savedInvoice = await this.invoiceRepository.save(invoice);

    const chargeEntities = charges.map((charge) =>
      this.invoiceChargeRepository.create({
        ...charge,
        invoice: savedInvoice,
      })
    );
    const savedCharges =
      await this.invoiceChargeRepository.save(chargeEntities);
    savedInvoice.charges = savedCharges;

    return savedInvoice;
  }

  async getInvoiceByShipmentId(shipmentId: string): Promise<Invoice | null> {
    return this.invoiceRepository.findOne({
      where: { shipment: { id: shipmentId } }
    })
  }

  async updateInvoice(invoice: Invoice): Promise<Invoice> {
    return this.invoiceRepository.save(invoice);
  }
}
