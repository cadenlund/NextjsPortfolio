import React from "react";
import Image from "next/image";
import Link from "next/link"; // <-- 1. Add the import for the Link component
import { projectsData } from "../../data/projects";

const FeaturedProjects: React.FC = () => {
    // Filter to get only the featured projects
    const featuredProjects = projectsData.filter(project => project.isFeatured);

    return (
        <div className="w-full max-w-7xl mx-auto mt-32 px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-medium text-gray-800 dark:text-gray-300 mb-8">
                Featured Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
                {featuredProjects.map((project) => (
                    <div key={project.slug}
                         className="overflow-hidden rounded-lg shadow-lg bg-white dark:bg-neutral-800 flex flex-col transition-transform duration-300 ease-in-out hover:scale-105">

                        <div className="relative w-full aspect-video">
                            <Image
                                src={project.image}
                                alt={`${project.title} Cover`}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                {project.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 flex-grow">
                                {project.description}
                            </p>

                            {/* --- 2. Updated button logic --- */}
                            <div className="flex gap-4 mt-4">
                                {(() => {
                                    // Check if the link is external (starts with http)
                                    const isExternal = project.primaryActionLink?.startsWith('http');

                                    if (isExternal) {
                                        // Render a standard <a> tag for external links
                                        return (
                                            <a
                                                href={project.primaryActionLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                {project.primaryActionText || "View Site"}
                                            </a>
                                        );
                                    } else {
                                        // Render a Next.js <Link> for internal pages
                                        return (
                                            <Link
                                                href={project.primaryActionLink || `/projects/${project.slug}`}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                {project.primaryActionText || "View Details"}
                                            </Link>
                                        );
                                    }
                                })()}

                                {/* GitHub link should always be an external link */}
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