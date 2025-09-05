import { Body, Controller, Get, Param, Post, Patch } from '@nestjs/common';
import { ShoppingRequestsService } from './shopping-requests.service';
import { CreateShoppingRequestDto } from './dto/create-shopping-request.dto';
import { ShoppingRequestResponseDto } from './dto/shopping-request-response.dto';

@Controller('shopping-requests')
export class ShoppingRequestsController {
  constructor(
    private readonly shoppingRequestsService: ShoppingRequestsService,
  ) {}

  @Post()
  async create(
    @Body() createShoppingRequestDto: CreateShoppingRequestDto,
  ): Promise<ShoppingRequestResponseDto> {
    return this.shoppingRequestsService.createShoppingRequest(
      createShoppingRequestDto,
    );
  }

  @Get()
  async findAll(): Promise<ShoppingRequestResponseDto[]> {
    return this.shoppingRequestsService.getAllShoppingRequests();
  }

  @Get(':userId')
  async findByUser(
    @Param('userId') userId: string,
  ): Promise<ShoppingRequestResponseDto[]> {
    return this.shoppingRequestsService.getShoppingRequestsByUser(userId);
  }

  @Get('detail/by-code/:requestCode')
  async findOneByCode(
    @Param('requestCode') requestCode: string,
  ): Promise<ShoppingRequestResponseDto> {
    return this.shoppingRequestsService.getShoppingRequestByCode(requestCode);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ): Promise<ShoppingRequestResponseDto> {
    return this.shoppingRequestsService.updateStatus(id, body.status);
  }

  @Patch(':id/slips')
  async addPaymentSlip(
    @Param('id') id: string,
    @Body() body: { url: string },
  ): Promise<ShoppingRequestResponseDto> {
    return this.shoppingRequestsService.addPaymentSlip(id, body.url);
  }
}
