"use client";

import React, { useEffect, useState } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import type { Engine } from "tsparticles-engine";

const ParticlesBackground: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // This hook now only handles dark mode detection.
    useEffect(() => {
        const checkDarkMode = () => {
            setIsDarkMode(document.documentElement.classList.contains("dark"));
        };
        checkDarkMode(); // Initial check

        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        return () => observer.disconnect(); // Cleanup
    }, []);

    const particlesInit = async (main: Engine): Promise<void> => {
        await loadFull(main);
    };

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            // The key forces a re-render when the theme changes, ensuring colors update.
            key={isDarkMode ? "dark" : "light"}
            options={{
                fullScreen: { enable: false },
                fpsLimit: 60, // Capping FPS is good for performance
                particles: {
                    number: { value: 40, density: { enable: true, value_area: 800 } },
                    color: { value: isDarkMode ? "#ffffff" : "#333333" },
                    links: { // Renamed from line_linked
                        color: isDarkMode ? "#ffffff" : "#333333",
                        distance: 150,
                        enable: true,
                        opacity: isDarkMode ? 0.3 : 0.8,
                        width: 1,
                    },
                    move: { enable: true, speed: 0.5, outModes: { default: "out" } },
                    opacity: { value: 0.5 },
                    size: { value: { min: 1, max: 2 } },
                },
                interactivity: {
                    events: { onHover: { enable: true, mode: "grab" } },
                    modes: { grab: { distance: 200 } },
                },
                background: { color: "transparent" },
            }}
            // The change is here 👇: Using Tailwind classes with position: fixed
            className="fixed top-0 left-0 w-full h-full z-0"
        />
    );
};

export default ParticlesBackground;