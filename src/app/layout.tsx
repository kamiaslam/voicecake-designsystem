import { headers } from "next/headers";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import Providers from "./providers";
import "./globals.css";

const interDisplay = localFont({
    src: [
        {
            path: "../../public/fonts/InterDisplay-Light.woff2",
            weight: "300",
        },
        {
            path: "../../public/fonts/InterDisplay-Regular.woff2",
            weight: "400",
        },
        {
            path: "../../public/fonts/InterDisplay-Medium.woff2",
            weight: "500",
        },
        {
            path: "../../public/fonts/InterDisplay-SemiBold.woff2",
            weight: "600",
        },
        {
            path: "../../public/fonts/InterDisplay-Bold.woff2",
            weight: "700",
        },
    ],
    variable: "--font-inter-display",
});

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Dashboard",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                {/* Google Fonts - Inter, Roboto Condensed & JetBrains Mono */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Roboto+Condensed:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
                {/* Description no longer than 155 characters */}
                <meta
                    name="description"
                    content="Dashboard - AI-Powered Voice Communication Platform"
                />
                {/* Product Name */}
                <meta
                    name="product-name"
                    content="Dashboard"
                />
                {/* Twitter Card data */}
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:site" content="@voicecake" />
                <meta
                    name="twitter:title"
                    content="Dashboard"
                />
                <meta
                    name="twitter:description"
                    content="AI-Powered Voice Communication Platform with Conversa & Empath Agents 🔥"
                />
                <meta name="twitter:creator" content="@voicecake" />
                <meta
                    name="twitter:image"
                    content="%PUBLIC_URL%/twitter-card.png"
                />
                {/* Open Graph data for Facebook */}
                <meta
                    property="og:title"
                    content="Dashboard"
                />
                <meta property="og:type" content="Article" />
                <meta
                    property="og:url"
                    content="https://voicecake.com/dashboard"
                />
                <meta
                    property="og:image"
                    content="%PUBLIC_URL%/fb-og-image.png"
                />
                <meta
                    property="og:description"
                    content="AI-Powered Voice Communication Platform with Conversa & Empath Agents 🔥"
                />
                <meta
                    property="og:site_name"
                    content="Dashboard"
                />
                <meta property="fb:admins" content="132951670226590" />
                {/* Open Graph data for LinkedIn */}
                <meta
                    property="og:title"
                    content="Dashboard"
                />
                <meta
                    property="og:url"
                    content="https://voicecake.com/dashboard"
                />
                <meta
                    property="og:image"
                    content="%PUBLIC_URL%/linkedin-og-image.png"
                />
                <meta
                    property="og:description"
                    content="AI-Powered Voice Communication Platform with Conversa & Empath Agents 🔥"
                />
                {/* Open Graph data for Pinterest */}
                <meta
                    property="og:title"
                    content="Dashboard"
                />
                <meta
                    property="og:url"
                    content="https://voicecake.com/dashboard"
                />
                <meta
                    property="og:image"
                    content="%PUBLIC_URL%/pinterest-og-image.png"
                />
                <meta
                    property="og:description"
                    content="AI-Powered Voice Communication Platform with Conversa & Empath Agents 🔥"
                />
            </head>
            <body
                className={`${interDisplay.variable} bg-b-surface1 font-mono text-body-1 text-t-primary antialiased`}
            suppressHydrationWarning>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}

export async function generateViewport(): Promise<Viewport> {
    const userAgent = (await headers()).get("user-agent");
    const isiPhone = /iphone/i.test(userAgent ?? "");
    return isiPhone
        ? {
              width: "device-width",
              initialScale: 1,
              maximumScale: 1, // disables auto-zoom on ios safari
          }
        : {};
}
