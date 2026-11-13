/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IIremboPayResponse<T = any> {
     success: boolean;
     message: string;
     data: T;
     errors: { code: string; detail: string }[];
}

export interface IIremboPayInvoice {
     invoiceNumber: string;
     transactionId: string;
     paymentAccountIdentifier: string;
     // Documented values are NEW / PAID / PARTIALLY_PAID; anything else is treated as unpaid.
     paymentStatus: "NEW" | "PAID" | "PARTIALLY_PAID" | (string & {});
     amount: number;
     currency: string;
     paymentLinkUrl: string;
     paymentMethod?: string;
     createdAt?: string;
     paidAt?: string;
     expiryAt?: string;
}

export interface IIremboPayWebhookPayload {
     success: boolean;
     data: {
          invoiceNumber: string;
          transactionId: string;
          paymentStatus: "PAID" | "PARTIALLY_PAID" | "FAILED";
          paymentMethod?: string;
          amount: number;
          currency: string;
     };
}
