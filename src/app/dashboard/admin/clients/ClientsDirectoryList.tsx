"use client";

import { motion } from "motion/react";
import { ClientCard } from "@/components/containers/ClientsContainer";
import type { TClientDirectoryRow } from "@/lib/admin/clients-report";

export const ClientsDirectoryList = ({ clients }: { clients: TClientDirectoryRow[] }) => (
     <ul className="flex flex-col gap-2.5">
          {clients.map((c, i) => (
               <motion.li key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}>
                    <ClientCard client={c} payments={c.payments} variant="row" onDelete={() => {}} />
               </motion.li>
          ))}
     </ul>
);
