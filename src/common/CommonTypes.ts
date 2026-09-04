

export type TLocale = "en" | "kn" | "fr"

// Shared USD->RWF rate for plans priced in USD (IremboPay invoices must be in RWF).
export const USD_TO_RWF_RATE = 1500;

export enum ENotificationType  {
     WARNING, PASS, FAIL
}

export type FormState = {
     message:string,
     status:string
}
