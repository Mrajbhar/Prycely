import { useMutation } from '@tanstack/react-query';
import { paymentApi } from './paymentApi';

// The Razorpay global from the checkout.js script.
declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

interface StartArgs {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  onSuccess: () => void;
  onFailure: (message: string) => void;
}

export function useRazorpay() {
  const startPayment = useMutation({
    mutationFn: async (args: StartArgs) => {
      // 1. Ask our backend to create a Razorpay order.
      const info = await paymentApi.create(args.orderId);

      // 2. Open the Razorpay checkout popup.
      return new Promise<void>((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: info.keyId,
          amount: info.amount,
          currency: info.currency,
          order_id: info.razorpayOrderId,
          name: 'Prycely',
          description: `Order ${args.orderNumber}`,
          prefill: { name: args.customerName, email: args.customerEmail },
          theme: { color: '#c2410c' }, // your accent
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_signature: string;
          }) => {
            // 3. Verify on our server before trusting it.
            try {
              await paymentApi.verify({
                orderId: args.orderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });
              args.onSuccess();
              resolve();
            } catch {
              args.onFailure('Payment could not be verified. If money was deducted, contact support.');
              reject();
            }
          },
          modal: {
            ondismiss: () => {
              args.onFailure('Payment cancelled.');
              reject();
            },
          },
        });

        rzp.open();
      });
    },
  });

  return { startPayment: startPayment.mutate, isPending: startPayment.isPending };
}