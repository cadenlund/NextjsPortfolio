"use client";

import React, { useState, useEffect } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

const AnimatedToggle: React.FC = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [toggled, setToggled] = useState<boolean>(true); // Default visual state to dark

    // This effect now sets the theme based on localStorage, defaulting to dark.
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");

        // Default to dark unless 'light' is explicitly saved in localStorage.
        if (savedTheme === "light") {
            setToggled(false);
            document.documentElement.classList.remove("dark");
        } else {
            setToggled(true);
            document.documentElement.classList.add("dark");
        }

        setIsMounted(true);
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

    if (!isMounted) return null;

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