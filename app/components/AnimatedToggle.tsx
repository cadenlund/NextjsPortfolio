"use client";

import React, { useState, useEffect } from "react";
import { FiSun, FiMoon } from "react-icons/fi"; // Import icons

const AnimatedToggle: React.FC = () => {
    const [toggled, setToggled] = useState<boolean>();

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            setToggled(true);
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
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

    return (
        <div
            onClick={handleClick}
            className={`w-12 h-12 flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 ${
                toggled ? "bg-gray-800" : "bg-gray-200"
            }`}
        >
            {toggled ? (
                <FiMoon className="text-white w-6 h-6" /> // Moon Icon
            ) : (
                <FiSun className="text-black w-6 h-6" /> // Sun Icon
            )}
        </div>
    );
};

export default AnimatedToggle;
