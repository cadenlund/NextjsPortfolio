"use client";

import React, { useEffect, useState } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import type { Engine } from "tsparticles-engine";

const ParticlesBackground: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    // 1. New state to hold the particle count
    const [particleCount, setParticleCount] = useState(40);

    // Dark mode detection hook
    useEffect(() => {
        const checkDarkMode = () => {
            setIsDarkMode(document.documentElement.classList.contains("dark"));
        };
        checkDarkMode();
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    // 2. New hook to handle responsive particle count
    useEffect(() => {
        const handleResize = () => {
            // Tailwind's 'md' breakpoint is 768px
            if (window.innerWidth < 768) {
                setParticleCount(80); // More particles on smaller screens
            } else {
                setParticleCount(40); // Fewer particles on larger screens
            }
        };

        handleResize(); // Set initial count on component mount
        window.addEventListener("resize", handleResize); // Update count on resize

        // Cleanup event listener on component unmount
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const particlesInit = async (main: Engine): Promise<void> => {
        await loadFull(main);
    };

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            key={isDarkMode ? "dark" : "light"}
            options={{
                fullScreen: { enable: false },
                fpsLimit: 60,
                particles: {
                    // 3. Use the dynamic particleCount state here
                    number: { value: particleCount, density: { enable: true, value_area: 800 } },
                    color: { value: isDarkMode ? "#ffffff" : "#333333" },
                    links: {
                        color: isDarkMode ? "#ffffff" : "#333333",
                        distance: 150,
                        enable: true,
                        opacity: isDarkMode ? 0.3 : 0.8,
                        width: 1,
                    },
                    move: { enable: true, speed: 0.5, outModes: { default: "out" } },
                    opacity: { value: 0.5 },
                    size: { value: 1 },
                },
                interactivity: {
                    events: { onHover: { enable: true, mode: "grab" } },
                    modes: { grab: { distance: 200 } },
                },
                background: { color: "transparent" },
            }}
            className="fixed top-0 left-0 w-full h-full z-0"
        />
    );
};

export default ParticlesBackground;