"use client";

import { TUser } from "@/common/Entities";
import { createContext, useContext, useState, ReactNode } from "react";

interface AdminContextType {
  user: TUser | null | undefined;
  setUser: (user: TUser | null | undefined) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ userIn,children }: { children: ReactNode, userIn: TUser | null | undefined }) {
     const [user, setUser] = useState<TUser | null | undefined>(userIn);

  return (
    <AdminContext.Provider value={{ user, setUser }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminContext() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminContext must be used within an AdminProvider");
  }
  return context;
}
