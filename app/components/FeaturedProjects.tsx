import React from "react";
import Image from "next/image";

interface Project {
    title: string;
    description: string;
    liveLink: string;
    githubLink: string;
}

const projects: Project[] = [
    {
        title: "Predictive Sales Model",
        description: "A machine learning model to forecast sales trends.",
        liveLink: "#",
        githubLink: "#",
    },
    {
        title: "Portfolio Website",
        description: "A responsive portfolio built with Next.js and Tailwind CSS.",
        liveLink: "#",
        githubLink: "#",
    },
];

const FeaturedProjects: React.FC = () => {
    return (
        <div className="w-full max-w-[1200px] mx-auto mt-32">
            <h2 className="text-4xl font-medium text-gray-800 dark:text-gray-300 mb-8">
                Featured Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.map((project, index) => (
                    <div key={index} className="relative group rounded-lg shadow-lg overflow-hidden">
                        {/* Project Cover Image */}
                        <Image
                            src="/images/page/greyImage.jpg" // Path to greyImage
                            alt={`${project.title} Cover`}
                            width={600}
                            height={400}
                            className="rounded-lg"
                        />
                        {/* Overlay and Animations */}
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                            {/* Top Text Animation */}
                            <div className="transform -translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                                <h3 className="text-2xl font-semibold text-white mb-4">{project.title}</h3>
                                <p className="text-gray-300">{project.description}</p>
                            </div>

                            {/* Bottom Buttons Animation */}
                            <div className="self-start transform translate-y-10 group-hover:translate-y-0 group-hover:translate-x-0 transition-transform duration-500">
                                <div className="flex gap-4">
                                    <a
                                        href={project.liveLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                                    >
                                        View Project
                                    </a>
                                    <a
                                        href={project.githubLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-all"
                                    >
                                        View on GitHub
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturedProjects;
