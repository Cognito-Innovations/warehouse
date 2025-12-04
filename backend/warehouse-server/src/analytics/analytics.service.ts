import { Injectable } from '@nestjs/common';
import { PackagesService } from 'src/packages/service/packages.service';
import { PickupRequestsService } from 'src/pickup-requests/pickup-requests.service';
import { ShipmentsService } from 'src/shipments/shipments.service';
import { ShoppingRequestsService } from 'src/shopping-requests/shopping-requests.service';
import { UsersService } from 'src/users/users.service';
import { ShipmentStatus } from 'src/shipments/shipment.entity';
import { ShoppingRequestStatus } from 'src/shopping-requests/shopping-request.entity';

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
    const totalCustomers = await this.usersService.getUsersCount();

    const totalPackages = await this.packagesService.getPackagesCount();

    const actionRequiredPackages =
      await this.packagesService.getActionRequiredPackagesCount();

    const shipRequestShipments =
      await this.shipmentsService.getShipmentsCountByStatus(
        ShipmentStatus.SHIP_REQUEST,
      );
    const paymentPendingShipments =
      await this.shipmentsService.getShipmentsCountByStatus(
        ShipmentStatus.PAYMENT_PENDING,
      );
    const paymentApprovalShipments =
      await this.shipmentsService.getShipmentsCountByStatus(
        ShipmentStatus.PAYMENT_APPROVED,
      );
    const readyToShipShipments =
      await this.shipmentsService.getShipmentsCountByStatus(
        ShipmentStatus.READY_TO_SHIP,
      );
    const shippedShipments =
      await this.shipmentsService.getShipmentsCountByStatus(
        ShipmentStatus.DEPARTED,
      );

    const pickupRequested =
      await this.pickupRequestsService.getPickupRequestsCount();

    const shoppingRequested =
      await this.shoppingRequestsService.getShoppingRequestsCountByStatus(
        ShoppingRequestStatus.REQUESTED,
      );
    const quotationConfirm =
      await this.shoppingRequestsService.getShoppingRequestsCountByStatus(
        ShoppingRequestStatus.QUOTATION_READY,
      );
    const assistPaymentApproval =
      await this.shoppingRequestsService.getShoppingRequestsCountByStatus(
        ShoppingRequestStatus.PAYMENT_APPROVED,
      );

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
