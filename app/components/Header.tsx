import React from "react";
import Link from "next/link";
import AnimatedToggle from "./AnimatedToggle";
import Navbar from "./Navbar";

const Header: React.FC = () => {
    return (
        <header className="sticky top-0 bg-transparent z-50 pt-6">
            <div className="px-12 py-4 grid grid-cols-3 items-center gap-4 w-full">
                {/* Left: Logo */}
                <div className="flex items-center">
                    <Link href="/" prefetch={true}>
                        <div>
                            <div className="text-2xl font-medium tracking-tight">
                                Caden Lund
                            </div>
                            <div className="text-lg font-medium text-zinc-400">
                                ML Engineer
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Center: Navigation Pill */}
                <Navbar />

                {/* Right: Dark Mode Toggle */}
                <div className="flex justify-end">
                    <AnimatedToggle />
                </div>
            </div>
        </header>
    );
};

export default Header;
