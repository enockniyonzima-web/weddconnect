
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import MainNotificationContainer from "@/components/Notifications/ManNotificationCard";
import { AuthProvider } from "@/components/context/AuthContext";
import { getSessionUser } from "@/server-actions/user.actions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WeddConnect - Find Top Wedding Vendors & Plan Your Dream Wedding",
  description:
    "WeddConnect helps couples connect with the best wedding vendors, from venues to photographers, catering, and more. Plan your perfect wedding with ease.",
  keywords: [
    "wedding vendors",
    "wedding planning",
    "wedding services",
    "best wedding venues",
    "wedding photographers",
    "wedding decorators",
    "wedding caterers",
    "bridal makeup",
    "wedding dresses",
    "wedding florists",
    "wedding entertainment",
    "wedding event planning",
  ],
  openGraph: {
    title: "WeddConnect - Your Ultimate Wedding Vendor Marketplace",
    description:
      "Find and connect with top wedding vendors for your special day. WeddConnect makes wedding planning stress-free and seamless.",
    url: "https://weddconnect.com",
    type: "website",
    images: [
      {
        url: "https://weddconnect.com/og-image.png", // Replace with an actual image URL
        width: 1200,
        height: 675,
        alt: "WeddConnect - Wedding Vendor Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@weddconnect", // Replace with your Twitter handle
    title: "WeddConnect - Connect with Top Wedding Vendors",
    description:
      "Plan your dream wedding by connecting with the best wedding vendors on WeddConnect.",
    images: ["https://weddconnect.com/og-image.png"], // Replace with an actual image URL
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://weddconnect.com",
  },
};



export default async function RootLayout({ 
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {user} = await getSessionUser();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full max-w-[1512px]`}
      >
        <AuthProvider authUser={user}>
          {children}
          <MainNotificationContainer />
        </AuthProvider>
        
      </body>
    </html>
  );
}
