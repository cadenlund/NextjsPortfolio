"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import ParticlesBackground from "./ParticlesBackground";

const ParticleWrapper: React.FC = () => {
    const pathname = usePathname(); // Get the current route for unique key

    return (
        <div className="absolute inset-0 z-10">
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={pathname}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{duration: 2 }}
                    className="absolute inset-0"
                >
                    <ParticlesBackground />
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default ParticleWrapper;
