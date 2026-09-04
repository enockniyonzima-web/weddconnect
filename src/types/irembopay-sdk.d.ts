// The installed SDK (@irembo/irembopay-node-sdk) ships no type declarations at all,
// so this is a minimal ambient typing covering only what we actually call.
// Kept in its own script-style .d.ts (no top-level import/export) so TypeScript
// treats it as a fresh module declaration rather than an augmentation of nothing.
declare module "@irembo/irembopay-node-sdk" {
     type IIremboPayResponse<T> = import("./irembo-pay").IIremboPayResponse<T>;
     type IIremboPayInvoice = import("./irembo-pay").IIremboPayInvoice;

     interface IIremboPayCreateInvoiceInput {
          transactionId: string;
          paymentAccountIdentifier: string;
          paymentItems: { code: string; quantity: number; unitAmount: number }[];
          expiryAt?: string;
          description?: string;
          language?: "EN" | "FR" | "RW";
          customer?: { email?: string; phoneNumber?: string; name?: string };
     }

     interface IIremboPayMobileMoneyInput {
          accountIdentifier: string;
          paymentProvider: "MTN" | "AIRTEL";
          invoiceNumber: string;
          transactionReference?: string;
     }

     export default class IremboPay {
          constructor(secretKey: string, environment: "sandbox" | "production" | "checkout");
          invoice: {
               createInvoice(data: IIremboPayCreateInvoiceInput): Promise<IIremboPayResponse<IIremboPayInvoice>>;
               getInvoice(invoiceReference: string): Promise<IIremboPayResponse<IIremboPayInvoice>>;
          };
          payment: {
               mobileMoney: {
                    initiatePayment(data: IIremboPayMobileMoneyInput): Promise<IIremboPayResponse<{ accountIdentifier: string; paymentProvider: string; invoiceNumber: string; amount: number; referenceId: string }>>;
               };
          };
     }
}
