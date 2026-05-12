"use client";

import { CustomButton } from "@/components/ui/custom-buttons";
import { logoutUser } from "@/server-actions/auth";
import { Loader2 } from "lucide-react";
import { ComponentProps, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "sonner";

export const LogoutButton = ({...props}: ComponentProps<typeof CustomButton>) => {
     const {setUser} = useAuthContext();
     const [loading,setLoading] = useState(false);
     const logout = async () => {
          return toast.promise(
               (async() => {
                    setLoading(true);
                    await logoutUser();
                    setUser(null);
                    setLoading(false);
               })(),
               {
                    loading: "Logging you out...",
                    success: "Logout successful! Redirecting...",
                    error: "Error logging you out. Please try again."
               }
          )
     }

     return <CustomButton disabled={loading} {...props} onClick={logout} icon={loading ? <Loader2 size={18} className="animate-spin" /> : props.icon} />
}