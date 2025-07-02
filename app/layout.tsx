import React from "react";
import "./globals.css";
import ParticleWrapper from "./components/ParticleWrapper";

export default function RootLayout({ children }: { children: React.ReactNode }) {

    return (
        <html lang="en" className="dark">
        <body
            className="relative min-h-screen ease-in-out bg-white dark:bg-neutral-900 text-gray-900 dark:text-gray-100"
        >
        <ParticleWrapper />

        <main className="relative z-10">{children}</main>
        </body>
        </html>
    );
}
