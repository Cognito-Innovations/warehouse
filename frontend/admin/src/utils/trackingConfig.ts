import ApprovePaymentButton from "../components/ActionButtons/ApprovePaymentButton"
import CommercialInvoiceButton from "../components/ActionButtons/CommercialInvoiceButton"
import DiscardButton from "../components/ActionButtons/DiscardButton"
import DiscardShipmentButton from "../components/ActionButtons/DiscardShipmentButton"
import MasterShipmentButton from "../components/ActionButtons/MasterShipmentButton"
import PrintCarrierLabelButton from "../components/ActionButtons/PrintCarrierLabelButton"
import PrintHoldLabelButton from "../components/ActionButtons/PrintHoldLabel"
import PrintLabelButton from "../components/ActionButtons/PrintLabelButton"
import RaiseInvoiceButton from "../components/ActionButtons/RaiseInvoiceButton"
import UpdateToDepartedButton from "../components/ActionButtons/UpdateToDepartedButton"

export const TRACKING_STATUS = {
  ALL: 'ALL',
  ACTION_REQUIRED: 'Action Required',
  IN_REVIEW: 'In Review',
  READY_TO_SEND: 'Ready To Send',
  REQUESTED: 'REQUESTED',
  QUOTED: 'QUOTED',
  CONFIRMED: 'CONFIRMED',
  PICKED: 'PICKED',
  CANCELLED: 'CANCELLED',
  READY_TO_SHIP: 'Ready To Ship',
  SHIP_REQUEST: 'SHIP_REQUEST',
  SHIPPED: 'SHIPPED',
  DISCARDED: 'DISCARDED',
  INVOICED: 'INVOICED',
  PAYMENT_PENDING: 'PAYMENT_PENDING',
  PAYMENT_APPROVAL_PENDING: 'PAYMENT_APPROVAL_PENDING',
  PAYMENT_APPROVED: 'PAYMENT_APPROVED',
  DEPARTED_FROM_ORIGIN: 'DEPARTED'
}

export const FEATURE_CONFIG = {
  PACKAGE : 'PACKAGE',
  SHIPMENT : 'SHIPMENT',
}

export const StatusActionMap = {
  [FEATURE_CONFIG.PACKAGE]: {
    [TRACKING_STATUS.ACTION_REQUIRED]: [
      {
        id:0,
        label: 'Action Required',
        component: PrintLabelButton,
      },
    ],
    [TRACKING_STATUS.IN_REVIEW]: [
      {
        id:0,
        label: 'Print Label',
        component: PrintLabelButton,
      },
      {
        id:1,
        label: 'Discard',
        component: DiscardButton,
      },
    ],
    [TRACKING_STATUS.READY_TO_SEND]: [
      {
        id:0,
        label: 'Print Label',
        component: PrintLabelButton,
      },
      {
        id:1,
        label: 'Discard',
        component: DiscardButton,
      },
    ],
  },

  [FEATURE_CONFIG.SHIPMENT]: {
    [TRACKING_STATUS.SHIP_REQUEST]: [
      {
        id:0,
        label: 'Raise Invoice',
        component: RaiseInvoiceButton,
      },
      {
        id:1,
        label: 'Print Hold Label',
        component: PrintHoldLabelButton,
      },
      {
        id:2,
        label: 'Commercial Invoice',
        component: CommercialInvoiceButton,
      },
    ],
    [TRACKING_STATUS.PAYMENT_PENDING]: [
      {
        id:0,
        label: 'Approve Payment',
        component: ApprovePaymentButton,
      },
      {
        id:1,
        label: 'Print Hold Label',
        component: PrintHoldLabelButton,
      },
      {
        id:2,
        label: 'Discard',
        component: DiscardShipmentButton,
      },
      {
        id:3,
        label: 'Commercial Invoice',
        component: CommercialInvoiceButton,
      },
    ],
    [TRACKING_STATUS.PAYMENT_APPROVAL_PENDING]: [
      {
        id:0,
        label: 'Approve Payment',
        component: ApprovePaymentButton,
      },
      {
        id:1,
        label: 'Print Hold Label',
        component: PrintHoldLabelButton,
      },
      {
        id:2,
        label: 'Commercial Invoice',
        component: CommercialInvoiceButton,
      },
    ],
    [TRACKING_STATUS.PAYMENT_APPROVED]: [
      {
        id:0,
        label: 'Print Hold Label',
        component: PrintHoldLabelButton,
      },
      {
        id:1,
        label: 'Print Carrier Label',
        component: PrintCarrierLabelButton,
      },
      {
        id:2,
        label: 'Commercial Invoice',
        component: CommercialInvoiceButton,
      },
    ],
    [TRACKING_STATUS.READY_TO_SHIP]: [
      {
        id:0,
        label: 'Update to Departed',
        component: UpdateToDepartedButton,
      },
      {
        id:1,
        label: 'Print Hold Label',
        component: PrintHoldLabelButton,
      },
      {
        id:2,
        label: 'Print Carrier Label',
        component: PrintCarrierLabelButton,
      },
      {
        id:3,
        label: 'Commercial Invoice',
        component: CommercialInvoiceButton,
      },
    ],
    [TRACKING_STATUS.DEPARTED_FROM_ORIGIN]: [
      {
        id:1,
        label: 'Master Shipment',
        component: MasterShipmentButton,
      },
      {
        id:1,
        label: 'Print Hold Label',
        component: PrintHoldLabelButton,
      },
      {
        id:2,
        label: 'Print Carrier Label',
        component: PrintCarrierLabelButton,
      },
      {
        id:3,
        label: 'Commercial Invoice',
        component: CommercialInvoiceButton,
      },
    ],
  }
}