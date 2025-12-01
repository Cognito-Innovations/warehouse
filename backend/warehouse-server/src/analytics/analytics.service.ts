import { Injectable } from '@nestjs/common';
import { PackagesService } from 'src/packages/service/packages.service';
import { PickupRequestsService } from 'src/pickup-requests/pickup-requests.service';
import { ShipmentsService } from 'src/shipments/shipments.service';
import { ShoppingRequestsService } from 'src/shopping-requests/shopping-requests.service';
import { UsersService } from 'src/users/users.service';
import { ShipmentStatus } from 'src/shipments/shipment.entity';
import {
  ShoppingRequest,
  ShoppingRequestStatus,
} from 'src/shopping-requests/shopping-request.entity';
import { PackageResponseDto } from 'src/packages/dto/package-response.dto';
import { PickupRequestResponseDto } from 'src/pickup-requests/dto/pickup-request-response.dto';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

export interface DashboardMetrics {
  customers: number;
  activePackages: number;
  actionRequiredPackages: number;
  shipRequestShipments: number;
  paymentPendingShipments: number;
  paymentApprovalShipments: number;
  readyToShipShipments: number;
  shippedShipments: number;
  pickupRequested: number;
  shoppingRequested: number;
  quotationConfirm: number;
  assistPaymentApproval: number;
}

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly packagesService: PackagesService,
    private readonly shipmentsService: ShipmentsService,
    private readonly pickupRequestsService: PickupRequestsService,
    private readonly shoppingRequestsService: ShoppingRequestsService,
  ) {}

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const users: UserResponseDto[] = await this.usersService.getAllUsers();
    const totalCustomers = users.length;

    const packages: PackageResponseDto[] =
      await this.packagesService.getAllPackages();
    const totalPackages = packages.length;
    const actionRequiredPackages = packages.filter(
      (pkg) => pkg.status?.value === 'Action Required',
    ).length

    const rawShipments = await this.shipmentsService.getAllShipments();
    const shipRequestShipments = rawShipments.filter(
      (shipment: any) => shipment.status === ShipmentStatus.SHIP_REQUEST,
    ).length;
    const paymentPendingShipments = rawShipments.filter(
      (shipment: any) => shipment.status === ShipmentStatus.PAYMENT_PENDING,
    ).length;
    const paymentApprovalShipments = rawShipments.filter(
      (shipment: any) => shipment.status === ShipmentStatus.PAYMENT_APPROVED,
    ).length;
    const readyToShipShipments = rawShipments.filter(
      (shipment: any) => shipment.status === ShipmentStatus.READY_TO_SHIP,
    ).length;
    const shippedShipments = rawShipments.filter(
      (shipment: any) => shipment.status === ShipmentStatus.DEPARTED,
    ).length;

    const pickupRequests: PickupRequestResponseDto[] =
      await this.pickupRequestsService.getAllPickupRequests();
    const pickupRequested = pickupRequests.length;

    const shoppingRequests: ShoppingRequest[] =
      await this.shoppingRequestsService.getAllShoppingRequests();
    const shoppingRequested = shoppingRequests.filter(
      (sr) => sr.status === ShoppingRequestStatus.REQUESTED,
    ).length;
    const quotationConfirm = shoppingRequests.filter(
      (sr) => sr.status === ShoppingRequestStatus.QUOTATION_READY,
    ).length;
    const assistPaymentApproval = shoppingRequests.filter(
      (sr) => sr.status === ShoppingRequestStatus.PAYMENT_APPROVED,
    ).length;

    return {
      customers: totalCustomers,
      activePackages: totalPackages,
      actionRequiredPackages,
      shipRequestShipments,
      paymentPendingShipments,
      paymentApprovalShipments,
      readyToShipShipments,
      shippedShipments,
      pickupRequested,
      shoppingRequested,
      quotationConfirm,
      assistPaymentApproval,
    };
  }
}
