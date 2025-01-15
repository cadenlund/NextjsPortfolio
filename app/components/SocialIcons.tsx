"use client";

import React from "react";
import { FaGithub, FaLinkedin, FaFileDownload, FaEnvelope } from "react-icons/fa"; // Import icons
import { Tooltip } from "react-tooltip";
import 'react-tooltip/dist/react-tooltip.css'; // Import default styles

const SocialIcons: React.FC = () => {
    return (
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
    );
};

export default SocialIcons;
