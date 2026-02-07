"use client";

import { TSubscription } from "@/common/Entities";
import { createContext, ReactNode, useState, useContext, Dispatch, SetStateAction } from "react";

interface ISubscriptionsContext {
     subscriptions: TSubscription[];
     setSubscriptions?: Dispatch<SetStateAction<TSubscription[]>>;
}

export const SubscriptionsContext = createContext<ISubscriptionsContext | undefined>(undefined);

export function SubscriptionsProvider({children, subs}: {children: ReactNode, subs: TSubscription[]}) {
     const [subscriptions,setSubscriptions] = useState(subs);

     return (
          <SubscriptionsContext.Provider value={{subscriptions,setSubscriptions}}>{children}</SubscriptionsContext.Provider>
     )
}

export function useSubscriptions() {
     const context = useContext(SubscriptionsContext);
     if(!context) throw new Error("useSubscriptions must be used within a SubscriptionsProvider");
     return context;
}