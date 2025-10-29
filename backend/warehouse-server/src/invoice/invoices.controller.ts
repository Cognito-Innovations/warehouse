import { Controller, Post, Param, Body } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { Invoice } from './entities/invoice.entity';
import { ShoppingRequest } from 'src/shopping-requests/shopping-request.entity';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post(':shoppingRequestId')
  async createInvoice(
    @Param('shoppingRequestId') shoppingRequestId: string,
  ): Promise<Invoice> {
    const shoppingRequest = { id: shoppingRequestId } as ShoppingRequest;
    return this.invoicesService.createInvoice(shoppingRequest);
  }
}
