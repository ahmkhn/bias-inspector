import "~/styles/globals.css";
import "@uploadthing/react/styles.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { TopNav } from "./_components/topnav";
import {NextSSRPlugin} from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { Toaster } from "sonner";
import {CSPostHogProvider} from "./_analytics/providers";
import { Footer } from "./_components/footer";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Bias Inspector",
  description: "Bias Inspector: The AI-powered tool that scans research papers for colonial, gender, and regional biases. Elevate your academic content with our cutting-edge NLP technology.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <CSPostHogProvider>
        <html lang="en" className={`${GeistSans.variable} flex flex-col gap-4 `}>
          <NextSSRPlugin
                /**
                 * The `extractRouterConfig` will extract **only** the route configs
                 * from the router to prevent additional information from being
                 * leaked to the client. The data passed to the client is the same
                 * as if you were to fetch `/api/uploadthing` directly.
                 */
                routerConfig={extractRouterConfig(ourFileRouter)}
              />
          <body>

            <TopNav/>
            {children}
            <SpeedInsights/>
            <Footer/>
            <Toaster/>
          </body>
        </html>
      </CSPostHogProvider>
    </ClerkProvider>
  );
}
