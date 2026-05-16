import { Instagram, Twitter, Youtube } from "lucide-react";
import { FaTiktok, FaWhatsapp } from "react-icons/fa6";
import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";

export interface ISocialLink {
  name: string;
  handle: string;
  description: string;
  icon: LucideIcon | IconType;
  href: string;
  color: string;       // tailwind bg for hover glow
  iconColor: string;   // tailwind text color
}

export const SocialLinks: ISocialLink[] = [
  {
    name: "Instagram",
    handle: "@weddconnect_rw",
    description: "Behind-the-scenes, venue tours & real wedding inspiration.",
    icon: Instagram,
    href: "https://www.instagram.com/weddconnect_rw",
    color: "hover:border-pink-500/60 hover:bg-pink-500/5",
    iconColor: "text-pink-400",
  },
  {
    name: "TikTok",
    handle: "@weddconnect",
    description: "Short wedding clips, venue reels & viral planning tips.",
    icon: FaTiktok,
    href: "https://www.tiktok.com/@weddconnect?_r=1&_t=ZS-96PqoAvLRQq",
    color: "hover:border-white/30 hover:bg-white/5",
    iconColor: "text-white",
  },
  {
    name: "Whatsapp",
    handle: "Weddconnect",
    description: "Get more information about how we can help you plan your wedding.",
    icon: FaWhatsapp,
    href: "https://wa.me/250790860446",
    color: "hover:border-gray-400/60 hover:bg-gray-400/5",
    iconColor: "text-gray-300",
  },
  {
    name: "YouTube",
    handle: "WeddConnect",
    description: "Venue walkthroughs, planning guides & couple stories.",
    icon: Youtube,
    href: "https://www.youtube.com/@weddconnect",
    color: "hover:border-red-500/60 hover:bg-red-500/5",
    iconColor: "text-red-400",
  },
];