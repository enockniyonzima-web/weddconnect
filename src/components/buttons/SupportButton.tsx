"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Headset, ChevronRight } from "lucide-react";
import { ContactInfo } from "@/lib/data/contact-info";

const buildWhatsAppUrl = (phone: string, message: string) => {
  const clean = phone.replace(/\D/g, "");
  return `https://wa.me/${clean}?text=${encodeURIComponent(message)}`;
};

export const SupportButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3">
      {/* Contact options panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex flex-col gap-2 w-[260px] bg-gray-950 border border-gray-800 rounded-2xl p-4 shadow-2xl shadow-black/60"
          >
            {/* Header */}
            <div className="flex items-center gap-2 pb-2 border-b border-gray-800">
              <div className="w-8 h-8 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <Headset size={15} className="text-green-400" />
              </div>
              <div>
                <p className="text-white text-xs font-semibold">WeddConnect Support</p>
                <p className="text-gray-500 text-[10px]">We reply within minutes</p>
              </div>
            </div>

            {/* Contact options */}
            <div className="flex flex-col gap-2 pt-1">
              {ContactInfo.map((contact) => (
                <a
                  key={contact.id}
                  href={buildWhatsAppUrl(contact.phone, contact.autoMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="group flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-gray-900 hover:bg-green-500/10 border border-gray-800 hover:border-green-500/40 transition-all duration-200"
                >
                  <div className="flex items-center gap-2.5">
                    {/* WhatsApp icon */}
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 text-green-400 shrink-0"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    <div>
                      <p className="text-white text-xs font-medium">{contact.domain}</p>
                      <p className="text-gray-500 text-[10px]">{contact.description}</p>
                    </div>
                  </div>
                  <ChevronRight size={13} className="text-gray-600 group-hover:text-green-400 transition-colors duration-200" />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB toggle button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={open ? "Close support" : "Open support chat"}
        className="relative w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 shadow-lg shadow-green-900/40 flex items-center justify-center transition-colors duration-200 cursor-pointer group"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={22} className="text-white" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle size={22} className="text-white" />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Hover ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full ring-0 group-hover:ring-4 ring-green-400/30 transition-all duration-300 pointer-events-none" />
        )}
      </motion.button>
    </div>
  );
};
