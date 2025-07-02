"use client";

import React, { useState, useEffect } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

const AnimatedToggle: React.FC = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [toggled, setToggled] = useState<boolean>(false); // Default to light

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

        if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
            setToggled(true);
            document.documentElement.classList.add("dark");
        } else {
            setToggled(false);
            document.documentElement.classList.remove("dark");
        }

        setIsMounted(true); // Ensures no render before theme is known
    }, []);

    const handleClick = () => {
        const newToggle = !toggled;
        setToggled(newToggle);

        if (newToggle) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    if (!isMounted) return null; // Prevent mismatches during SSR/initial render

    return (
        <div
            onClick={handleClick}
            className={`w-12 h-12 flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 ${
                toggled ? "bg-gray-800" : "bg-gray-200"
            }`}
        >
            {toggled ? (
                <FiMoon className="text-white w-6 h-6" />
            ) : (
                <FiSun className="text-black w-6 h-6" />
            )}
        </div>
    );
};

export default AnimatedToggle;
