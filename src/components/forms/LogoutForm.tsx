"use client";

import { CustomButton } from "@/components/ui/custom-buttons";
import { logoutUser } from "@/server-actions/auth";
import { Loader2 } from "lucide-react";
import { ComponentProps, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { showMainNotification } from "@/util/NotificationFuncs";
import { ENotificationType } from "@/common/CommonTypes";

export const LogoutButton = ({...props}: ComponentProps<typeof CustomButton>) => {
     const {setUser} = useAuthContext();
     const [loading,setLoading] = useState(false);
     const logout = async () => {
          setLoading(true)
          showMainNotification("Logging...", ENotificationType.WARNING);
          await logoutUser();
          setUser(null);
          setLoading(false);
          return showMainNotification("You have been logged out!", ENotificationType.PASS);
     }

     return <CustomButton disabled={loading} {...props} onClick={logout} icon={loading ? <Loader2 size={18} className="animate-spin" /> : props.icon} />
}