import React from "react";
import Image from "next/image";
// Assuming your central data file is set up
import { projectsData } from "../../data/projects";

const FeaturedProjects: React.FC = () => {
    // Filter to get only the featured projects, just like before
    const featuredProjects = projectsData.filter(project => project.isFeatured);

    return (
        <div className="w-full max-w-[1200px] mx-auto mt-32 px-4 sm:px-0">
            <h2 className="text-4xl font-medium text-gray-800 dark:text-gray-300 mb-8">
                Featured Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
                {featuredProjects.map((project) => (
                    <div key={project.slug}
                         className="overflow-hidden rounded-lg shadow-lg bg-white dark:bg-neutral-800 flex flex-col transition-transform duration-300 ease-in-out hover:scale-105">
                        {/* --- 1. Consistent Image Container --- */}
                        {/* This div sets a consistent aspect ratio. The Image inside will fill it without resizing the card. */}
                        <div className="relative w-full aspect-video">
                            <Image
                                src={project.image}
                                alt={`${project.title} Cover`}
                                fill // 'fill' makes the image act like a background
                                className="object-cover transition-transform duration-500" // Subtle zoom on hover
                            />
                        </div>

                        {/* --- 2. Always-Visible Content Area --- */}
                        {/* On mobile, this is just a standard content block. On desktop, it will contain the hover elements. */}
                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                {project.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 flex-grow">
                                {project.description}
                            </p>

                            {/* --- 3. Buttons are always visible at the bottom --- */}
                            <div className="flex gap-4 mt-4">
                                <a
                                    href={project.primaryActionLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    {project.primaryActionText}
                                </a>
                                {project.githubLink && (
                                    <a
                                        href={project.githubLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
                                    >
                                        GitHub
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturedProjects;