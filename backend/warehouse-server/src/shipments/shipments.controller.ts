import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Req,
  Query,
  BadRequestException,
  Delete,
  Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ShipmentsService } from './shipments.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { ShipmentResponseDto } from './dto/shipment-response.dto';
import { ShipmentStatus } from './shipment.entity';
import { UpdateShipmentDto } from './dto/update-shipment.dto';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email?: string;
    role?: string;
  };
}

@Controller('shipments')
@UseGuards(JwtAuthGuard)
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Post()
  async create(
    @Body() createShipmentDto: CreateShipmentDto,
    @Req() req: any,
  ): Promise<ShipmentResponseDto> {
    const userId = req.user.id;
    return this.shipmentsService.createShipment(createShipmentDto, userId);
  }

  @Get()
  async findAll() {
    return this.shipmentsService.getAllShipments();
  }

  @Get('by-status')
  async getByStatus(@Query('status') status?: string) {
    if (!status) {
      throw new BadRequestException('Status query parameter is required');
    }
    return this.shipmentsService.getShipmentsByStatus(status);
  }

  @Get('/search')
  async searchShipment(
    @Query('trackingNumber') trackingNumber: string,
    @Query('status') status: ShipmentStatus,
  ): Promise<ShipmentResponseDto> {
    return this.shipmentsService.findByTrackingNumberAndStatus(
      trackingNumber,
      status,
    );
  }

  @Get('detail/by-shipmentNo/:shipmentNo')
  async findOneByShipmentNo(
    @Param('shipmentNo') shipmentNo: string,
  ): Promise<ShipmentResponseDto> {
    return this.shipmentsService.getShipmentByShipmentNo(shipmentNo);
  }

  @Get(':userId')
  async findByUser(
    @Param('userId') userId: string,
  ): Promise<ShipmentResponseDto[]> {
    return this.shipmentsService.getShipmentsByUser(userId);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: ShipmentStatus },
  ): Promise<ShipmentResponseDto> {
    return this.shipmentsService.updateStatus(id, body.status);
  }

  @Patch(':id')
  async updateShipment(
    @Param('id') id: string,
    @Body() payload: UpdateShipmentDto,
  ) {
    return this.shipmentsService.updateShipmentById(id, payload);
  }

  @Post(':id/documents')
  async addShipmentDocument(
    @Param('id') id: string,
    @Body()
    body: {
      data: {
        url: string;
        original_filename: string;
        mime_type?: string;
        file_size?: number;
        category: 'PAYMENT' | 'SHIPMENT_PHOTO';
      };
    },
    @Req() req: AuthenticatedRequest,
  ): Promise<ShipmentResponseDto> {
    return this.shipmentsService.addShipmentDocument(
      id,
      body.data,
      req.user.id
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    return this.shipmentsService.deleteShipment(id);
  }
}
