import { NextRequest, NextResponse } from "next/server";
import { verifyIremboSignature } from "@/config/iremboConfig";
import { reconcileInvoicePayment } from "@/server-actions/irembo-pay/invoice";
import { IIremboPayWebhookPayload } from "@/types/irembo-pay";

export async function POST(req: NextRequest) {
     // Everything is inside this single try/catch — including signature verification — so any
     // unexpected failure gets our own diagnostic log and a controlled response, instead of an
     // opaque 500 that neither we nor IremboPay can act on.
     try {
          const rawBody = await req.text();
          const signature = req.headers.get("irembopay-signature");

          if (!verifyIremboSignature(rawBody, signature)) {
               console.warn("IremboPay webhook: invalid signature");
               return NextResponse.json({ message: "invalid signature" }, { status: 401 });
          }

          const payload: IIremboPayWebhookPayload = JSON.parse(rawBody);
          const { invoiceNumber, paymentStatus, paymentMethod } = payload.data;

          const res = await reconcileInvoicePayment(invoiceNumber, paymentStatus, paymentMethod);
          if (res.error) console.warn("IremboPay webhook:", res.error, invoiceNumber);

          return NextResponse.json({ message: "success", success: true });
     } catch (error) {
          // Do not let IremboPay retry on our bugs — log and ack.
          console.error("IremboPay webhook error:", error);
          return NextResponse.json({ message: "error", success: false }, { status: 200 });
     }
}
