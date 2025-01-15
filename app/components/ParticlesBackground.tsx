import React, { useEffect, useState } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import type { Engine } from "tsparticles-engine";

const ParticlesBackground: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showParticles, setShowParticles] = useState(false); // Control visibility

    // Delay rendering of particles
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowParticles(true);
        }, 10); // Delay

        return () => clearTimeout(timer); // Cleanup timeout
    }, []);

    // Dark mode detection
    useEffect(() => {
        if (typeof window !== "undefined") {
            const checkDarkMode = () => {
                setIsDarkMode(document.documentElement.classList.contains("dark"));
            };

            checkDarkMode();
            const observer = new MutationObserver(() => checkDarkMode());
            observer.observe(document.documentElement, { attributes: true });

            return () => observer.disconnect();
        }
    }, []);

    const particleColor = isDarkMode ? "#ffffff" : "#333333";
    const lineColor = isDarkMode ? "#ffffff" : "#333333";
    const lightModeOpacity = isDarkMode ? "0.3" : "0.7";

    if (!showParticles) return null; // Render nothing until delay passes

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            options={{
                fullScreen: { enable: false },
                particles: {
                    number: { value: 50, density: { enable: true, value_area: 700 } },
                    color: { value: particleColor },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: lineColor,
                        opacity: lightModeOpacity,
                        width: 1,
                    },
                    opacity: { value: 0.5 },
                    size: { value: 1, random: true },
                    move: { enable: true, speed: 0.7, outModes: { default: "out" } },
                },
                interactivity: {
                    detect_on: "window",
                    events: {
                        onhover: { enable: true, mode: "grab" },
                    },
                    modes: {
                        grab: { distance: 200, line_linked: { opacity: 0.8 } },
                    },
                },
                retina_detect: true,
                background: { color: "transparent" },
            }}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 0,
                opacity: 1,
                transition: "opacity 0.5s ease-in-out",
            }}
        />
    );
};

const particlesInit = async (main: Engine): Promise<void> => {
    await loadFull(main);
};

export default ParticlesBackground;
