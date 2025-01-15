"use client";

import React from "react";
import { FaGithub, FaLinkedin, FaFileDownload, FaEnvelope } from "react-icons/fa"; // Import icons
import { Tooltip } from "react-tooltip";
import 'react-tooltip/dist/react-tooltip.css'; // Import default styles

const Hero: React.FC = () => {
    return (
        <div className="h-[400px] flex relative justify-center text-black dark:text-white">
            {/* Main CSS grid container */}
            <div className="grid gap-4 grid-cols-7 grid-rows-4 w-full h-full max-w-[1200px] relative">
                {/* Introductory Text */}
                <div className="col-start-1 col-span-4 row-start-1 row-span-2 flex flex-col justify-start">
                    <p className="text-xl text-gray-900 dark:text-gray-300 mb-2">Hi, I&apos;m Caden</p>
                    <h1 className="text-5xl font-bold mb-4">
                    Machine Learning Developer
                    </h1>
                    <p className="text-lg text-gray-900 dark:text-gray-300 mb-6">
                        I am a junior developer from specializing in machine learning with Python and TensorFlow,
                        while also crafting responsive and user-friendly interfaces with React, TypeScript, and Tailwind.
                    </p>

                    {/* Social Icons with Tooltips */}
                    <div className="flex space-x-4 mt-4">
                        {/* GitHub Icon */}
                        <a
                            href="https://github.com/cadenlund"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-tooltip-id="github-tooltip"
                            data-tooltip-content="GitHub"
                            className="text-gray-800 dark:text-gray-300 hover:text-black dark:hover:text-white"
                        >
                            <FaGithub size={24} />
                        </a>
                        <Tooltip id="github-tooltip" place="top" />

                        {/* LinkedIn Icon */}
                        <a
                            href="https://linkedin.com/in/caden-lund-330041292"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-tooltip-id="linkedin-tooltip"
                            data-tooltip-content="LinkedIn"
                            className="text-gray-800 dark:text-gray-300 hover:text-black dark:hover:text-white"
                        >
                            <FaLinkedin size={24} />
                        </a>
                        <Tooltip id="linkedin-tooltip" place="top" />

                        {/* Email Icon */}
                        <a
                            href="mailto:yourname@example.com"
                            data-tooltip-id="email-tooltip"
                            data-tooltip-content="Email Me"
                            className="text-gray-800 dark:text-gray-300 hover:text-black dark:hover:text-white"
                        >
                            <FaEnvelope size={24} />
                        </a>
                        <Tooltip id="email-tooltip" place="top" />
                        {/* Resume Download Icon */}
                        <a
                            href="/path-to-your-resume.pdf"
                            download
                            data-tooltip-id="resume-tooltip"
                            data-tooltip-content="Download Resume"
                            className="text-gray-800 dark:text-gray-300 hover:text-black dark:hover:text-white"
                        >
                            <FaFileDownload size={24} />
                        </a>
                        <Tooltip id="resume-tooltip" place="top" />
                    </div>
                </div>

                {/* Rectangle with rounded corners */}
                <div className="col-start-6 col-span-3 row-start-1 row-span-4 bg-gray-200 dark:bg-neutral-800 rounded-lg shadow-lg">
                    {/* Optional content inside the rectangle */}
                </div>
            </div>
        </div>
    );
};

export default Hero;
