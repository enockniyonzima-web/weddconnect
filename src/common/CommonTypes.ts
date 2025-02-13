

export type TLocale = "en" | "kn" | "fr"

export enum ENotificationType  {
     WARNING, PASS, FAIL
}

export type FormState = {
     message:string,
     status:string
}