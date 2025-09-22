import DiscardButton from "../components/ActionButtons/DiscardButton"
import PrintLabelButton from "../components/ActionButtons/PrintLabelButton"

export enum TRACKING_STATUS {
  ALL = 'ALL',
  ACTION_REQUIRED = 'Action Required',
  IN_REVIEW = 'IN_REVIEW',
  REQUESTED = 'REQUESTED',
  QUOTED = 'QUOTED',
  CONFIRMED = 'CONFIRMED',
  PICKED = 'PICKED',
  CANCELLED = 'CANCELLED',
  READY_TO_SHIP = 'READY_TO_SHIP',
  REQUEST_SHIP = 'REQUEST_SHIP',
  SHIPPED = 'SHIPPED',
  DISCARDED = 'DISCARDED',
  INVOICED = 'INVOICED',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAYMENT_APPROVED = 'PAYMENT_APPROVED',
}

export const FEATURE_CONFIG = {
  PACKAGE : 'PACKAGE',
  SHIPMENT : 'SHIPMENT',
}

//TOD0: Rename these names by researching or asking gpt etc
export const STATUS_CONFIG = {
  [FEATURE_CONFIG.PACKAGE]: {
    [TRACKING_STATUS.ACTION_REQUIRED]: [
      {
      id:0,
      label: 'Action Required',
      component: PrintLabelButton, //need to import PrintLabel component
    }, {
      id:1,
      label: 'Discard',
      component: DiscardButton, //need to import Discard component
    }
  ],
    [TRACKING_STATUS.READY_TO_SHIP]: [{
      id:0,
      label: 'Print Label',
      component: PrintLabelButton, //need to import PrintLabel component
    }, {
      id:1,
      label: 'Discard',
      component: DiscardButton, //need to import Discard component
    }],
  },
    // TODO: Need to implement the Request Ship and Approve Payment buttons
    [TRACKING_STATUS.REQUESTED]: [{
      id:0,
      label: 'Request Ship',
      // component: RequestShip, //TODO: need to import RequestShip component
    }, {
      id:1,
      label: 'Approve Payment',
      // component: ApprovePayment, //TODO: need to import ApprovePayment component
    }],
}