"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

const Navbar: React.FC = () => {
    const pathname = usePathname();
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (pathname === "/") {
            setActiveIndex(0);
        } else if (pathname === "/projects") {
            setActiveIndex(1);
        }
    }, [pathname]);

    return (
        <nav className="relative flex justify-center items-center">
            <div className="relative w-[200px] h-[50px] bg-opacity-5 dark:bg-opacity-50 dark:bg-neutral-900 backdrop-blur-md py-3 px-4 rounded-full border border-black border-opacity-15 dark:border-white dark:border-opacity-10 dark:shadow-md">
                <motion.div
                    animate={{
                        left: activeIndex === 0 ? "2%" : "50%",
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 40,
                    }}
                    className="absolute top-1 bottom-1 w-[48%] bg-neutral-900 rounded-full z-0 opacity-10 dark:opacity-5 dark:bg-white backdrop-blur-md"
                />
                <span
                    className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 transition-colors duration-100 cursor-pointer"
                    style={{ left: "25%" }}
                >
                    <Link href="/" prefetch={true}>
                        About
                    </Link>
                </span>
                <span
                    className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 transition-colors duration-100 cursor-pointer"
                    style={{ left: "75%" }}
                >
                    <Link href="/projects" prefetch={true}>
                        Projects
                    </Link>
                </span>
            </div>
        </nav>
    );
};

export default Navbar;
