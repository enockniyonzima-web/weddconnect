"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateClient } from "@/server-actions/client.actions";
import { TClientSettings } from "@/select-types/client";
import { Loader2, Save, User, Phone, Mail, CheckCircle } from "lucide-react";
import Image from "next/image";
import queryClient from "@/lib/queryClient";

type Props = { client: TClientSettings };

export function ProfileSettingsForm({ client }: Props) {
     const [name, setName] = useState(client.name);
     const [phone, setPhone] = useState(client.phone);
     const [saved, setSaved] = useState(false);

     const { mutate, isPending } = useMutation({
          mutationFn: async () => {
               await updateClient(client.id, { name: name.trim(), phone: phone.trim() });
          },
          onSuccess: () => {
               queryClient.cancelQueries();
               setSaved(true);
               setTimeout(() => setSaved(false), 3000);
          },
     });

     const dirty = name.trim() !== client.name || phone.trim() !== client.phone;
     const canSave = dirty && name.trim().length >= 2 && phone.trim().length >= 5 && !isPending;

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (canSave) mutate(); }}
      className="flex flex-col gap-5"
    >
      {/* Avatar */}
      <div className="flex items-center gap-4 bg-gray-900 border border-gray-800 rounded-2xl p-4">
        <div className="relative size-14 rounded-2xl overflow-hidden bg-gray-800 border border-gray-700 shrink-0">
          {client.user.image ? (
            <Image src={client.user.image} alt={client.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User size={22} className="text-gray-500" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">{client.name}</p>
          <p className="text-xs text-gray-500 truncate">{client.user.email}</p>
        </div>
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
          <User size={12} /> Full Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-600/50 transition-colors"
        />
      </div>

      {/* Phone */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
          <Phone size={12} /> Phone Number
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Your phone number"
          className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-600/50 transition-colors"
        />
      </div>

      {/* Email (readonly) */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
          <Mail size={12} /> Email Address
        </label>
        <input
          type="email"
          value={client.user.email}
          disabled
          className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-600 cursor-not-allowed"
        />
        <p className="text-xs text-gray-600">Email cannot be changed</p>
      </div>

      {/* Save button */}
      <button
        type="submit"
        disabled={!canSave}
        className="flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-sm font-semibold text-white transition-colors self-start"
      >
        {isPending ? (
          <><Loader2 size={14} className="animate-spin" /> Saving…</>
        ) : saved ? (
          <><CheckCircle size={14} /> Saved!</>
        ) : (
          <><Save size={14} /> Save changes</>
        )}
      </button>
    </form>
  );
}
