"use client";

import { TSessionUser } from "@/common/Entities";
import { createContext, ReactNode, useContext, useState } from "react";

interface AuthContextType {
     user: TSessionUser | null | undefined;
     setUser: (user: TSessionUser | null | undefined) => void;
     authOn: boolean;
     setAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({authUser, children}:{children: ReactNode, authUser: TSessionUser | null | undefined}) {
     const [user, setUser] = useState<TSessionUser | null | undefined>(authUser);
     const [authOn, setAuthOn] = useState(false);

     const setAuth  = () => setAuthOn(prev => !prev)
     
     return (
          <AuthContext.Provider value={{user, setUser, authOn, setAuth}}>
               {children}
          </AuthContext.Provider>
     )
}

export function useAuthContext() {
     const context = useContext(AuthContext);
     if (!context) {
          throw new Error("useAuthContext must be used within an AuthProvider");
     }
     return context;
}