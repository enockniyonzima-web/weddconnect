"use client";

import { Button } from "@headlessui/react";
import { ComponentProps, ReactNode } from "react"

export const CustomButton = ({name, icon, ...btnProps}: {name?:string, icon?: ReactNode} & ComponentProps<typeof Button>) => {

     return(
          <Button {...btnProps} >{icon ?? null} {name ?? null}</Button>
     )
}

export const DeleteButton = ({name, icon, entityId ,...btnProps}: {name?:string, icon?: ReactNode, entityId:string} & ComponentProps<typeof Button>) => {

     return(
          <Button {...btnProps} id={entityId} >{icon ?? null} {name ?? null}</Button>
     )
}

export const EntityButton = ({name, icon, entityId ,...btnProps}: {name?:string, icon?: ReactNode, entityId?:string} & ComponentProps<typeof Button>) => {

     return(
          <Button {...btnProps} id={entityId ?? btnProps.id} >{icon ?? null} {name ?? null}</Button>
     )
}