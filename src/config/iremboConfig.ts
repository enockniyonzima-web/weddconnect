import IremboPay from "@irembo/irembopay-node-sdk";
import crypto from "crypto";

export const iPay = new IremboPay(
     process.env.IPAY_SECRET_KEY || "",
     (process.env.IPAY_ENVIRONMENT as "sandbox" | "production") || "sandbox"
);

export const IPAY_PAYMENT_ACCOUNT_IDENTIFIER = process.env.IPAY_PAYMENT_ACCOUNT_IDENTIFIER || "";

function parseSignatureHeader(header: string): { t?: string; s?: string } {
     const parsed: Record<string, string> = {};
     for (const part of header.split(",")) {
          const idx = part.indexOf("=");
          if (idx === -1) continue;
          parsed[part.slice(0, idx).trim()] = part.slice(idx + 1).trim();
     }
     return parsed;
}

// Docs: HMAC_SHA256(secretKey, "<timestamp>#<rawBody>"), header is "t=<timestamp>, s=<signature>"
export function verifyIremboSignature(rawBody: string, signatureHeader: string | null): boolean {
     if (!signatureHeader) return false;
     const { t: timestamp, s: signature } = parseSignatureHeader(signatureHeader);
     if (!timestamp || !signature) return false;

     const expected = crypto
          .createHmac("sha256", process.env.IPAY_SECRET_KEY || "")
          .update(`${timestamp}#${rawBody}`)
          .digest("hex");

     const expectedBuf = Buffer.from(expected);
     const signatureBuf = Buffer.from(signature);
     if (expectedBuf.length !== signatureBuf.length) return false;
     return crypto.timingSafeEqual(expectedBuf, signatureBuf);
}
