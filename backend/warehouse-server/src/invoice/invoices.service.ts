import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice, InvoiceStatus } from './invoice.entity';
import { ShoppingRequest } from 'src/shopping-requests/shopping-request.entity';
import { ShoppingRequestProduct } from 'src/products/shopping-request-product.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(ShoppingRequestProduct)
    private readonly productRepository: Repository<ShoppingRequestProduct>,
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

  async updateInvoice(invoice: Invoice): Promise<Invoice> {
    return this.invoiceRepository.save(invoice);
  }
}
