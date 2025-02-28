"use client";

import { TUser } from "@/common/Entities";
import { createContext, ReactNode, useContext, useState } from "react";

interface AuthContextType {
     user: TUser | null | undefined;
     setUser: (user: TUser | null | undefined) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({authUser, children}:{children: ReactNode, authUser: TUser | null | undefined}) {
     const [user, setUser] = useState<TUser | null | undefined>(authUser);
     
     return (
          <AuthContext.Provider value={{user, setUser}}>
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