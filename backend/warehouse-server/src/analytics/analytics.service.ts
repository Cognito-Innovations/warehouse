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

  async getDashboardMetrics(countryId?: string): Promise<DashboardMetrics> {
    const totalCustomers = await this.usersService.getUsersCount();

    const totalPackages =
      await this.packagesService.getPackagesCount(countryId);

    const actionRequiredPackages =
      await this.packagesService.getActionRequiredPackagesCount(countryId);

    const shipRequestShipments =
      await this.shipmentsService.getShipmentsCountByStatus(
        ShipmentStatus.SHIP_REQUEST,
        countryId,
      );
    const paymentPendingShipments =
      await this.shipmentsService.getShipmentsCountByStatus(
        ShipmentStatus.PAYMENT_PENDING,
        countryId,
      );
    const paymentApprovalShipments =
      await this.shipmentsService.getShipmentsCountByStatus(
        ShipmentStatus.PAYMENT_APPROVED,
        countryId,
      );
    const readyToShipShipments =
      await this.shipmentsService.getShipmentsCountByStatus(
        ShipmentStatus.READY_TO_SHIP,
        countryId,
      );
    const shippedShipments =
      await this.shipmentsService.getShipmentsCountByStatus(
        ShipmentStatus.DEPARTED,
        countryId,
      );

    const pickupRequested =
      await this.pickupRequestsService.getPickupRequestsCount(countryId);

    const shoppingRequested =
      await this.shoppingRequestsService.getShoppingRequestsCountByStatus(
        ShoppingRequestStatus.REQUESTED,
        countryId,
      );
    const quotationConfirm =
      await this.shoppingRequestsService.getShoppingRequestsCountByStatus(
        ShoppingRequestStatus.QUOTATION_READY,
        countryId,
      );
    const assistPaymentApproval =
      await this.shoppingRequestsService.getShoppingRequestsCountByStatus(
        ShoppingRequestStatus.PAYMENT_APPROVED,
        countryId,
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
