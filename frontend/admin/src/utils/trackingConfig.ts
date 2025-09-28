import ApprovePaymentButton from "../components/ActionButtons/ApprovePaymentButton"
import CommercialInvoiceButton from "../components/ActionButtons/CommercialInvoiceButton"
import DiscardButton from "../components/ActionButtons/DiscardButton"
import PrintCarrierLabelButton from "../components/ActionButtons/PrintCarrierLabelButton"
import PrintHoldLabelButton from "../components/ActionButtons/PrintHoldLabel"
import PrintLabelButton from "../components/ActionButtons/PrintLabelButton"
import RaiseInvoiceButton from "../components/ActionButtons/RaiseInvoiceButton"

export enum TRACKING_STATUS {
  ALL = 'ALL',
  ACTION_REQUIRED = 'Action Required',
  IN_REVIEW = 'In Review',
  READY_TO_SEND = 'Ready To Send',
  REQUESTED = 'REQUESTED',
  QUOTED = 'QUOTED',
  CONFIRMED = 'CONFIRMED',
  PICKED = 'PICKED',
  CANCELLED = 'CANCELLED',
  READY_TO_SHIP = 'Ready To Ship',
  REQUEST_SHIP = 'Request Ship',
  SHIPPED = 'SHIPPED',
  DISCARDED = 'DISCARDED',
  INVOICED = 'INVOICED',
  PAYMENT_PENDING = 'Payment Pending',
  PAYMENT_APPROVED = 'Payment Approved',
  UPDATE_TO_DEPARTED = 'Departed'
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
    [TRACKING_STATUS.REQUEST_SHIP]: [
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
    [TRACKING_STATUS.UPDATE_TO_DEPARTED]: [
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