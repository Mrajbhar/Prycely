import { api, unwrap } from '../../lib/axios';
import type { ApiResponse } from '../../types/api';

export interface RazorpayOrderInfo {
  razorpayOrderId: string;
  amount: number;
  keyId: string;
  currency: string;
}

export const paymentApi = {
  create: (orderId: string) =>
    unwrap(api.post<ApiResponse<RazorpayOrderInfo>>(`/payment/create/${orderId}`)),

  verify: (payload: { orderId: string; razorpayPaymentId: string; razorpaySignature: string }) =>
    api.post<ApiResponse<null>>('/payment/verify', payload),
};