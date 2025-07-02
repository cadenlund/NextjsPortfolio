"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

const tabs = [
    { name: "About", href: "/" },
    { name: "Projects", href: "/projects" },
];

const Navbar: React.FC = () => {
    const pathname = usePathname();

    return (
        <nav className="relative flex justify-center items-center z-50">
            <div className="relative w-[200px] h-[50px] bg-opacity-5 dark:bg-opacity-50 dark:bg-neutral-900 backdrop-blur-md rounded-full border border-black border-opacity-15 dark:border-white dark:border-opacity-10 dark:shadow-md flex overflow-hidden">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.href;

                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className="relative flex-1 flex items-center justify-center text-sm font-medium z-10"
                        >
                            {tab.name}
                            {isActive && (
                                <motion.div
                                    layoutId="highlight"
                                    className="absolute inset-y-1 inset-x-1 rounded-full bg-white/80 dark:bg-white/10 z-0"
                                    transition={{
                                        type: "spring",
                                        stiffness: 450,
                                        damping: 40,
                                    }}
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default Navbar;
