export type PortonePaymentStatus =
  | 'PAID'
  | 'FAILED'
  | 'CANCELLED'
  | 'PARTIAL_CANCELLED'
  | 'VIRTUAL_ACCOUNT_ISSUED'
  | 'READY';

export type PortonePaymentResult = {
  status: PortonePaymentStatus;
  id: string;
  transactionId: string;
  merchantId: string;
  storeId: string;
  amount: { total: number };
};

/**
 * @description
 * 포트원 결제 취소 Response
 *
 * @docs
 * https://developers.portone.io/api/rest-v2/payment?v=v2#post%20%2Fpayments%2F%7BpaymentId%7D%2Fcancel
 */
export type PortoneSucceededPaymentCancellation = {
  status: 'SUCCEEDED' | 'FAILED' | 'REQUESTED';
  id: string;
  pgCancellationId?: string;
  reason: string;
  totalAmount: number;
  taxFreeAmount: number;
  vatAmount: number;
  easyPayDiscountAmount?: number;
  cancelledAt?: string;
  requestedAt: string;
  receiptUrl?: string; // 취소 영수증 URL. status 가 SUCCEEDED 일 때만 존재.
};
