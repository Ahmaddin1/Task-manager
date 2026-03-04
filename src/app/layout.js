import "./globals.css";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";

const mluvka = localFont({
  src: "../../Mluvka.otf",
  variable: "--mluvka-font",
  display: "swap",
});

const camood = localFont({
  src: "../../sooner.otf",
  variable: "--camood-font",
  display: "swap",
});

export const metadata = {
  title: "TASKIFY-Task Tracker",
  description: "Created in NEXT.Js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${mluvka.variable} ${camood.variable} min-h-screen bg-[#D7D7D7] font-mluvka text-black antialiased`}
      >
        <Providers>{children}</Providers>

        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            classNames: {
              success: "bg-green-600 text-white rounded-xl",
              error: "bg-red-600 text-white rounded-xl",
              warning: "bg-yellow-500 text-black rounded-xl",
              info: "bg-blue-600 text-white rounded-xl",
            },
          }}
        />
      </body>
    </html>
  );
}
