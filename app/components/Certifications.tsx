import React, { JSX } from "react";
// I've added FaExternalLinkAlt for the button icon
import {  FaExternalLinkAlt } from "react-icons/fa";
import { BsNvidia } from "react-icons/bs";
import { FaGraduationCap } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";

interface Certification {
    title: string;
    organization: string;
    date: string;
    icon: JSX.Element;
    // 👇 Change 1: Added a URL for the certificate link
    url: string;
}

const certifications: Certification[] = [
    {
        title: "Nvidia Deep Learning Certificate",
        organization: "Nvidia Deep Learning Institute",
        date: "June 2025",
        icon: <BsNvidia className="w-10 h-10 text-green-500" />,
        url: "https://learn.nvidia.com/certificates?id=hAEVPvvQQNeex74wo-cOvQ",
    },
    {
        title: "LSU Digital Marketing Science",
        organization: "Louisiana State University",
        date: "February 2025",
        icon: <FaGraduationCap className="w-10 h-10 text-purple-500" />,
        url: "https://www.credential.net/b8037b56-7672-4f1f-8405-64109804f322#acc.iYOKMx05", // Replace with your actual certificate URL
    },
    {
        title: "Google Analytics Certifcation",
        organization: "Google",
        date: "January 2025",
        icon: <FcGoogle className="w-10 h-10 text-blue-500" />,
        url: "https://skillshop.credential.net/80475a4e-321c-4adc-9b9d-afd919ff47d6#acc.n2PtiIAR", // Replace with your actual certificate URL
    },
];

const Certifications: React.FC = () => {
    return (
        // 👇 Change 2: Removed lg:min-h-[700px] to eliminate extra space at the bottom
        <div className="mx-auto max-w-7xl px-4 py-16 text-black dark:text-white sm:px-6 lg:px-8">

            <div className="text-left mb-12">
                <h2 className="text-4xl font-medium text-gray-800 dark:text-gray-300">
                    Certifications
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 grid-auto-rows-fr">
                {certifications.map((cert, index) => (
                    <div
                        key={index}
                        // 👇 Change 3: Matched height to Skills component and kept flex layout
                        className="bg-gray-200 dark:bg-neutral-800 rounded-lg shadow-lg p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col min-h-[150px] md:min-h-[220px]"
                    >
                        {/* This div grows to push the button to the bottom */}
                        <div className="flex-grow">
                            <div className="flex items-start gap-4 mb-4">
                                {cert.icon}
                                <h3 className="text-xl font-medium text-gray-700 dark:text-gray-400">
                                    {cert.title}
                                </h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mt-2">
                                {cert.organization}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                                Issued: {cert.date}
                            </p>
                        </div>

                        {/* 👇 Change 4: Added the "View Certificate" button */}
                        <a
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 self-start inline-flex items-center gap-2 bg-gray-700 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300 dark:bg-neutral-700 dark:hover:bg-neutral-600"
                        >
                            View Certificate <FaExternalLinkAlt />
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Certifications;