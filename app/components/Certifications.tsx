import React, {JSX} from "react";
import { FaCertificate, FaAward, FaMedal } from "react-icons/fa";

interface Certification {
    title: string;
    organization: string;
    date: string;
    icon: JSX.Element;
}

const certifications: Certification[] = [
    {
        title: "Machine Learning Specialization",
        organization: "Coursera (Stanford University)",
        date: "January 2023",
        icon: <FaCertificate className="w-10 h-10 text-blue-600" />,
    },
    {
        title: "TensorFlow Developer Certificate",
        organization: "Google",
        date: "March 2023",
        icon: <FaAward className="w-10 h-10 text-yellow-500" />,
    },
    {
        title: "AWS Certified Solutions Architect",
        organization: "Amazon Web Services",
        date: "June 2022",
        icon: <FaMedal className="w-10 h-10 text-green-600" />,
    },
];

const Certifications: React.FC = () => {
    return (
        <div className="w-full max-w-[1200px] mx-auto mt-32">
            <h2 className="text-4xl font-medium text-gray-800 dark:text-gray-300 mb-8">
                Certifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {certifications.map((cert, index) => (
                    <div
                        key={index}
                        className="p-6 bg-gray-200 dark:bg-neutral-800 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-xl flex flex-col justify-between items-start"
                        style={{ height: "300px" }} // Ensures all boxes have the same height
                    >
                        <div className="flex items-center gap-4 mb-4">
                            {cert.icon}
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                {cert.title}
                            </h3>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                            {cert.organization}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Issued: {cert.date}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Certifications;
