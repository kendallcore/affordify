import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const poppins = Poppins({
    weight: ["400", "500", "600", "700"],
    variable: "--font-poppins",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Affordify | Buy Smarter. Live Better.",
    description: "Affordify finds the best products at the best prices — so you never overpay.",
    icons: {
        icon: [
            { url: "/icon.png", type: "image/png" },
            { url: "/favicon.ico" }
        ],
        apple: "/apple-icon.png"
    }
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
            <body className="min-h-screen flex flex-col">
                {children}
            </body>
        </html>
    );
}
