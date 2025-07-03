"use client"; // This must be at the top to use React Hooks

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AnimatedToggle from "./AnimatedToggle";
import Navbar from "./Navbar";

const Header: React.FC = () => {
    // State to hold the opacity of the logo
    const [logoOpacity, setLogoOpacity] = useState(1);

    useEffect(() => {
        const handleScroll = () => {
            const breakpoint = 1580; // The breakpoint for fading
            const shouldFade = window.innerWidth <= breakpoint;

            if (shouldFade) {
                const scrollY = window.scrollY;
                const fadeDistance = 100; // The distance over which to fade

                const newOpacity = Math.max(0, 1 - scrollY / fadeDistance);

                setLogoOpacity(newOpacity);
            } else {
                setLogoOpacity(1); // On wider screens, ensure fully visible
            }
        };

        // Add event listeners for scroll and window resize
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleScroll);

        // Initial call to set the correct state on load
        handleScroll();

        // Cleanup function to remove event listeners when the component unmounts
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, []); // Empty dependency array ensures this effect runs only once on mount

    return (
        <header className="sticky top-0 z-50 bg-transparent px-4 py-4 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between md:grid md:grid-cols-3">

                {/* Left: Logo - Now with dynamic opacity */}
                <div
                    className="flex justify-start transition-opacity duration-200"
                    style={{ opacity: logoOpacity }}
                >
                    <Link
                        href="/"
                        prefetch={true}
                        // Conditionally apply 'pointer-events-none' Tailwind class
                        className={logoOpacity < 0.1 ? "pointer-events-none" : ""}
                        aria-hidden={logoOpacity < 0.1} // Hides from screen readers
                        tabIndex={logoOpacity < 0.1 ? -1 : 0} // Makes it untabbable by keyboard
                    >
                        <div>
                            <div className="flex flex-col text-xl font-normal tracking-tight leading-tight sm:flex-row sm:gap-1.5">
                                <span>Caden</span>
                                <span>Lund</span>
                            </div>
                            <div className="text-md font-normal text-zinc-400 hidden md:block">
                                Quant Researcher
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Center: Navigation Pill */}
                <div className="justify-self-center">
                    <Navbar />
                </div>

                {/* Right: Dark Mode Toggle */}
                <div className="flex justify-end">
                    <AnimatedToggle />
                </div>
            </div>
        </header>
    );
};

export default Header;