import { EAspectRatio } from "./enums"

export interface IFileUploader {
     cb: (res:string) => unknown
     multicb?:(res: Array<string>) => unknown
     close: () => unknown
     title: string
     multipleFile?:boolean
     limit?:number
     aspectRatio?: EAspectRatio 
     uploadFolder?:string
}