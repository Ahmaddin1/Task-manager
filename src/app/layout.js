import "./globals.css";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";

const Mluvka = localFont({
  src: [
    {
      path: "../../public/fonts/my-font.otf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--myfont",
});

export const metadata = {
  title: "TASKIFY-Task Tracker",
  description: "Created in NEXT.Js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={` ${Mluvka.variable} antialiased`}>
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
