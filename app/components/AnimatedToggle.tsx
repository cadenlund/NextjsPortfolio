"use client";

import React, { useState, useEffect, useRef } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

const AnimatedToggle: React.FC = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [toggled, setToggled] = useState<boolean>(true);
    const [toggleOpacity, setToggleOpacity] = useState(1);
    // NEW: State to track if the element should be fully removed from the DOM
    const [isRemovedFromDom, setIsRemovedFromDom] = useState(false);

    // Ref to manage the timeout for delaying DOM removal
    const removeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Initial mount and theme setting
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "light") {
            setToggled(false);
            document.documentElement.classList.remove("dark");
        } else {
            setToggled(true);
            document.documentElement.classList.add("dark");
        }
        setIsMounted(true);
    }, []);

    // Logic for opacity based on scroll and resize
    useEffect(() => {
        const handleScrollAndResize = () => {
            const breakpoint = 1580;
            const shouldFade = window.innerWidth <= breakpoint;
            const fadeDistance = 100; // The distance over which to fade

            let newOpacity = 1; // Default to fully visible

            if (shouldFade) {
                const scrollY = window.scrollY;
                newOpacity = Math.max(0, 1 - scrollY / fadeDistance);
            }

            setToggleOpacity(newOpacity);

            // Manage the DOM removal based on opacity
            if (newOpacity < 0.05) { // If it's almost invisible
                // Only schedule removal if it's not already removed
                if (!isRemovedFromDom && !removeTimeoutRef.current) {
                    // Schedule removal after the CSS transition duration
                    removeTimeoutRef.current = setTimeout(() => {
                        setIsRemovedFromDom(true);
                        removeTimeoutRef.current = null;
                    }, 300); // IMPORTANT: This delay should match the 'transition-all duration-300' in your CSS
                }
            } else { // If it's becoming visible again
                // Clear any pending removal timeout
                if (removeTimeoutRef.current) {
                    clearTimeout(removeTimeoutRef.current);
                    removeTimeoutRef.current = null;
                }
                // Ensure it's rendered in the DOM
                if (isRemovedFromDom) {
                    setIsRemovedFromDom(false);
                }
            }
        };

        window.addEventListener("scroll", handleScrollAndResize);
        window.addEventListener("resize", handleScrollAndResize);
        handleScrollAndResize(); // Initial call to set state on load

        // Cleanup function
        return () => {
            window.removeEventListener("scroll", handleScrollAndResize);
            window.removeEventListener("resize", handleScrollAndResize);
            // Ensure timeout is cleared on component unmount
            if (removeTimeoutRef.current) {
                clearTimeout(removeTimeoutRef.current);
                removeTimeoutRef.current = null;
            }
        };
    }, [isRemovedFromDom]); // Add isRemovedFromDom to dependencies to ensure effect re-evaluates

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

    // NEW: Don't render the component at all if it's supposed to be removed from DOM
    if (!isMounted || isRemovedFromDom) {
        return null;
    }

    return (
        <div
            onClick={handleClick}
            className={`w-12 h-12 flex items-center justify-center rounded-full cursor-pointer transition-all duration-300 ${ // Ensure transition-all includes opacity
                toggled ? "bg-neutral-950" : "bg-gray-200"
            }`}
            style={{
                opacity: toggleOpacity,
                // NEW: Disable pointer events when it's visually invisible to prevent clicks
                pointerEvents: toggleOpacity < 0.1 ? "none" : "auto",
            }}
            aria-hidden={toggleOpacity < 0.1} // Accessibility: hide from screen readers if almost invisible
            tabIndex={toggleOpacity < 0.1 ? -1 : 0} // Accessibility: make untabbable if almost invisible
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