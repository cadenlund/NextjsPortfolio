"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// --- Reusable Components ---
interface InputProps {
    id?: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}
const Input: React.FC<InputProps> = ({ placeholder, value, onChange, className }) => (
    <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
);

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    children: React.ReactNode;
    isActive?: boolean; // Add isActive prop for styling when selected
}
const Badge: React.FC<BadgeProps> = ({ children, className = "", isActive = false, ...props }) => (
    <span
        {...props}
        className={`px-2.5 py-0.5 text-sm rounded-full cursor-pointer transition transform hover:scale-105
        ${isActive ? "bg-blue-600 text-white ring-2 ring-offset-2 ring-blue-300" : "bg-white text-gray-800 border border-gray-300 dark:bg-neutral-700 dark:text-white dark:border-neutral-600 hover:bg-gray-100 dark:hover:bg-neutral-600"}
        ${className}`}
    >
        {children}
    </span>
);


// --- Example Projects Data ---
interface Project {
    slug: string;
    title: string;
    description: string;
    skills: string[];
    image: string;
    githubLink: string;
    dateAdded: string; // Or Date
    details: string;
    primaryActionText: string;
    primaryActionLink: string;
}
const projectsData = [
    {
        slug: "cadenlund-portfolio",
        title: "Cadenlund.com Website",
        description: "Personal website showcasing my portfolio, skills, and projects.",
        skills: ["JavaScript", "TypeScript", "Tailwind CSS", "React", "Next.js", "UI/UX"],
        image: "/images/cadenlundsite/mySite.png",
        githubLink: "https://github.com/cadenlund/NextjsPortfolio",
        dateAdded: "2025-01-15",
        details: "My personal portfolio website built with Next.js and Tailwind CSS, featuring a modern design and responsive layout.",
        primaryActionText: "View Report",
        primaryActionLink: "/projects/mot-real-time",
    },
    {
        slug: "Long-short-portfolio",
        title: "Alpha Factor Long-short Strategy",
        description: "Created alpha factors, evaluated them with Alphalens, and created a long short strategy",
        skills: ["Python", "Pandas", "NumPy", "SQL", "Matplotlib", "Alphalens", "VectorBT", "Quant Finance"],
        image: "/images/longshortportfolioproject/longshortportfoliocover.png",
        githubLink: "https://github.com/yourusername/Another-Project",  // no github
        dateAdded: "2025-05-18",
        details: "none",
        primaryActionText: "View Report",
        primaryActionLink: "/projects/Long-short-portfolio",
    },
    {
        slug: "Capitol-Companies",
        title: "Capitol Companies Website",
        description: "Front end website for Capitol Companies, a concrete and construction company.",
        skills: ["JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS", "UI/UX"],
        image: "/images/capitolcompanies/og-image.jpg",
        githubLink: "",
        dateAdded: "2025-07-03",
        details: "Details for another project.",
        primaryActionText: "View Site",
        primaryActionLink: "https://www.capitolcompanies.org",
    },
];


// Get unique skills across all projects
const allSkills = Array.from(new Set(projectsData.flatMap((proj) => proj.skills)));

export default function ProjectsGallery() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]); // Changed to an array for multi-select
    const [sortOrder, setSortOrder] = useState("newest"); // 'newest' or 'oldest'
    const [isSkillsDropdownOpen, setIsSkillsDropdownOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsSkillsDropdownOpen(true);
            } else {
                setIsSkillsDropdownOpen(false);
            }
        };

        handleResize(); // run on mount
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);


    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const handleSkillClick = (skill: string) => {
        setSelectedSkills((prev) =>
            prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
        );
    };

    // Sort projects by date
    const sortProjects = (projects: Project[]) => {
        if (sortOrder === "newest") {
            return projects.sort(
                (a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
            );
        } else {
            return projects.sort(
                (a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
            );
        }
    };

    // Filter + Sort
    const filteredProjects = sortProjects(
        projectsData.filter((project) => {
            const matchesSearch =
                !searchTerm ||
                project.title.toLowerCase().includes(searchTerm) ||
                project.description.toLowerCase().includes(searchTerm);

            // Check if ALL selected skills are present in the project's skills
            const matchesSkills =
                selectedSkills.length === 0 ||
                selectedSkills.every((skill) => project.skills.includes(skill));

            return matchesSearch && matchesSkills;
        })
    );

    return (
        <div className="px-12 py-6 space-y-6 max-w-7xl mx-auto mt-16">

            {/* Filter Container */}
            <div className="p-6 rounded-[30px] dark:bg-neutral-800 bg-gray-100 mb-12">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    Filter Projects
                </h2>

                {/* Flexible layout: all items aligned to the top */}
                <div className="flex flex-col gap-6 md:flex-row md:items-start">
                    {/* Left Section: Search + Date Sort */}
                    <div className="flex-1 space-y-4">
                        {/* Search */}
                        <div>
                            <label htmlFor="search" className="block mb-1 text-gray-700 dark:text-gray-300">
                                Search by Name/Description:
                            </label>
                            <Input
                                id="search"
                                placeholder="Search projects..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="w-full md:w-2/3 lg:w-1/2 bg-gray-200 dark:bg-neutral-700"
                            />
                        </div>

                        {/* Date Sorting */}
                        <div>
                            <label htmlFor="sortOrder" className="block mb-1 text-gray-700 dark:text-gray-300">
                                Sort by Date Added:
                            </label>
                            <select
                                id="sortOrder"
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="border rounded-lg p-2 bg-white dark:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                        </div>
                    </div>

                    {/* Right Section: Skill Filters */}
                    <div className="flex-1"> {/* Removed relative from here */}
                        <label
                            className="block mb-1 text-gray-700 dark:text-gray-300 font-semibold cursor-pointer select-none" // Added select-none to prevent text selection
                            onClick={() => setIsSkillsDropdownOpen(!isSkillsDropdownOpen)} // Toggle on click
                        >
                            Filter by Skill:{" "}
                            <span className="inline-block transform transition-transform duration-200"
                                  style={{ transform: isSkillsDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                &#9660; {/* Down caret */}
                            </span>
                        </label>

                        {/* Skill Badges Container - Accordion Style */}
                        <div
                            className={`flex flex-wrap gap-2 mt-2 transition-all duration-300 ease-in-out
                                ${isSkillsDropdownOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                        >
                            {allSkills.map((skill) => {
                                const isActive = selectedSkills.includes(skill);
                                return (
                                    <Badge
                                        key={skill}
                                        onClick={() => handleSkillClick(skill)}
                                        isActive={isActive}
                                    >
                                        {skill}
                                    </Badge>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                {filteredProjects.length > 0 ? (
                    filteredProjects.map((project, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-neutral-800 shadow-lg rounded-2xl overflow-hidden transform transition hover:scale-[1.01] flex flex-col h-full"
                        >
                            <div className="bg-gray-200 dark:bg-neutral-700 relative w-full h-48">
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover"
                                />
                            </div>

                            <div className="p-4 flex flex-col flex-1 h-full">
                                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                                    {project.title}
                                </h2>
                                <p className="text-gray-700 dark:text-gray-300 mb-2">
                                    {project.description}
                                </p>

                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                    Date Added: {new Date(project.dateAdded).toLocaleDateString()}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.skills.map((skill, i) => (
                                        <Badge key={i}
                                               className="bg-white text-gray-800 border border-gray-300 dark:bg-neutral-700 dark:text-white dark:border-neutral-600">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>

                                {/* this container is pushed to bottom */}
                                <div className="flex items-center gap-4 mt-auto">
                                    {project.primaryActionExternal ? (
                                        <a
                                            href={project.primaryActionLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg"
                                        >
                                            {project.primaryActionText || "View Details"}
                                        </a>
                                    ) : (
                                        <Link
                                            href={project.primaryActionLink || `/projects/${project.slug}`}
                                            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg"
                                        >
                                            {project.primaryActionText || "View Details"}
                                        </Link>
                                    )}


                                    {project.githubLink && (
                                        <Link
                                            href={project.githubLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-gray-600 text-white hover:bg-gray-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            GitHub
                                        </Link>
                                    )}

                                </div>
                            </div>
                        </div>

                    ))
                ) : (
                    <p className="text-gray-700 dark:text-gray-300 text-center col-span-full">No projects found matching
                        your criteria.</p>
                )}
            </div>
        </div>
    );
}