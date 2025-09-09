import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ShoppingRequestsService } from './shopping-requests.service';
import { CreateShoppingRequestDto } from './dto/create-shopping-request.dto';
import { ShoppingRequestResponseDto } from './dto/shopping-request-response.dto';

@ApiTags('Shopping Requests')
@ApiBearerAuth()
@Controller('shopping-requests')
@UseGuards(JwtAuthGuard)
export class ShoppingRequestsController {
  constructor(
    private readonly shoppingRequestsService: ShoppingRequestsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new shopping request' })
  @ApiCreatedResponse({
    description: 'Shopping request created successfully',
    type: ShoppingRequestResponseDto,
  })
  @ApiBody({
    type: CreateShoppingRequestDto,
    examples: {
      Example1: {
        summary: 'Basic Shopping Request',
        value: {
          user_id: 'user-123',
          request_code: 'REQ-001',
          country: 'India',
          items: 3,
          remarks: 'Need urgent delivery',
        },
      },
    },
  })
  async create(
    @Body() createShoppingRequestDto: CreateShoppingRequestDto,
  ): Promise<ShoppingRequestResponseDto> {
    return this.shoppingRequestsService.createShoppingRequest(
      createShoppingRequestDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all shopping requests' })
  @ApiOkResponse({
    description: 'List of all shopping requests',
    type: [ShoppingRequestResponseDto],
  })
  async findAll(): Promise<ShoppingRequestResponseDto[]> {
    return this.shoppingRequestsService.getAllShoppingRequests();
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get all shopping requests for a specific user' })
  @ApiOkResponse({
    description: 'List of user’s shopping requests',
    type: [ShoppingRequestResponseDto],
  })
  async findByUser(
    @Param('userId') userId: string,
  ): Promise<ShoppingRequestResponseDto[]> {
    return this.shoppingRequestsService.getShoppingRequestsByUser(userId);
  }

  @Get('detail/by-code/:requestCode')
  @ApiOperation({ summary: 'Get shopping request details by request code' })
  @ApiOkResponse({
    description: 'Shopping request found',
    type: ShoppingRequestResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Shopping request not found' })
  async findOneByCode(
    @Param('requestCode') requestCode: string,
  ): Promise<ShoppingRequestResponseDto> {
    return this.shoppingRequestsService.getShoppingRequestByCode(requestCode);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update status of a shopping request' })
  @ApiOkResponse({
    description: 'Shopping request status updated successfully',
    type: ShoppingRequestResponseDto,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'APPROVED',
        },
      },
    },
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ): Promise<ShoppingRequestResponseDto> {
    return this.shoppingRequestsService.updateStatus(id, body.status);
  }

  @Patch(':id/slips')
  @ApiOperation({ summary: 'Add a payment slip to a shopping request' })
  @ApiOkResponse({
    description: 'Payment slip added successfully',
    type: ShoppingRequestResponseDto,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          example: 'https://cdn.example.com/slips/payment-001.png',
        },
      },
    },
  })
  async addPaymentSlip(
    @Param('id') id: string,
    @Body() body: { url: string },
  ): Promise<ShoppingRequestResponseDto> {
    return this.shoppingRequestsService.addPaymentSlip(id, body.url);
  }
}
