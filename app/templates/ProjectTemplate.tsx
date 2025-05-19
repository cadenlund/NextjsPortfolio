"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function TemplatePage() {
    return (
        <motion.div
            // Start small & invisible, then animate to full size & visible
            initial={{ scale: 0.2, opacity: 0, originX: 0.5, originY: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            // Full-screen coverage
            className="fixed inset-0 z-50 bg-gray-200 dark:bg-neutral-800 overflow-auto p-6"
        >
            <Link
                href="/projects"
                className="fixed top-6 left-6 bg-gray-300 dark:bg-neutral-700 px-3 py-1 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-neutral-600 z-50"
            >
                ← Back
            </Link>

            <div className="max-w-4xl mx-auto mt-16 space-y-6">
            </div>
        </motion.div>
    );
}
