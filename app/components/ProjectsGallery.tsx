"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// --- Color Mapping Function ---
function getSkillColor(skill: string) {
    const codingLangs = new Set(["Python", "C", "C++", "Java", "JavaScript", "TypeScript"]);
    const databases = new Set(["SQL", "Postgres", "KDB+"]);
    const dataManip = new Set(["Pandas", "NumPy", "Matplotlib"]);
    const mlFrameworks = new Set(["OpenCV", "TensorFlow", "PyTorch", "Keras", "Scikit-learn"]);
    const uiUx = new Set(["React", "Next.js", "Tailwind CSS", "UI/UX", "Figma"]);
    const quantTools = new Set(["Alphalens", "VectorBT", "Backtrader", "Pyfolio"]);

    if (codingLangs.has(skill)) {
        return "bg-red-600 hover:bg-red-700 text-white";
    } else if (databases.has(skill)) {
        return "bg-indigo-600 hover:bg-indigo-700 text-white";
    } else if (dataManip.has(skill)) {
        return "bg-green-600 hover:bg-green-700 text-white";
    } else if (mlFrameworks.has(skill)) {
        return "bg-yellow-600 hover:bg-yellow-700 text-white";
    } else if (uiUx.has(skill)) {
        return "bg-teal-600 hover:bg-teal-700 text-white";
    } else if (quantTools.has(skill)) {
        return "bg-pink-600 hover:bg-pink-700 text-white";
    }
    // Default fallback color
    return "bg-gray-300 hover:bg-gray-400 text-black";
}



// --- Reusable Components ---
interface InputProps {
    id?: string; // 👈 Add this line
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
}
const Badge: React.FC<BadgeProps> = ({ children, className = "", ...props }) => (
    <span
        {...props}
        className={`px-2.5 py-0.5 text-sm rounded-full cursor-pointer transition transform hover:scale-105 ${className}`}
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
}
const projectsData = [
    {
        slug: "mot-real-time",
        title: "Multi-Object Tracking in Real-Time",
        description: "Computer vision project using Python and OpenCV for real-time object tracking.",
        skills: ["Python", "OpenCV", "Computer Vision", "Machine Learning", "Pandas"],
        image: "/images/.png",
        githubLink: "https://github.com/yourusername/MOT-Real-Time",
        dateAdded: "2023-01-15",
        details:
            "Implemented a multi-object tracking algorithm using SORT and Deep SORT with YOLOv5 for object detection.",
    },
    {
        slug: "Long-short-portfolio",
        title: "Alpha Factor Long-short Strategy",
        description: "Created alpha factors, evaluated them with Alphalens, and created a long short strategy",
        skills: ["Python", "Pandas", "NumPy", "SQL", "Matplotlib", "Alphalens", "VectorBT", "Quant Finance"],
        image: "/images/longshortportfolioproject/longshortportfoliocover.png",
        githubLink: "https://github.com/yourusername/HMM-Market-Regime",
        dateAdded: "2025-05-18",
        details:
            "none",
    },
];

// Get unique skills across all projects
const allSkills = Array.from(new Set(projectsData.flatMap((proj) => proj.skills)));

export default function ProjectsGallery() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSkill, setSelectedSkill] = useState("");
    const [sortOrder, setSortOrder] = useState("newest"); // 'newest' or 'oldest'

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const handleSkillClick = (skill: string) => {
        setSelectedSkill((prev) => (prev === skill ? "" : skill));
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

            const matchesSkill = !selectedSkill || project.skills.includes(selectedSkill);
            return matchesSearch && matchesSkill;
        })
    );

    return (
        <div className="px-12 py-6 space-y-6 max-w-7xl mx-auto mt-16">
            <h1 className="text-3xl font-bold">Projects</h1>

            {/* Filter Container */}
            <div className="p-6 rounded-[30px] dark:bg-neutral-800 bg-gray-100 mb-6">
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
                    <div className="flex-1">
                        <label className="block mb-1 text-gray-700 dark:text-gray-300 font-semibold">
                            Filter by Skill:
                        </label>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {allSkills.map((skill) => {
                                const isActive = skill === selectedSkill;
                                return (
                                    <Badge
                                        key={skill}
                                        onClick={() => handleSkillClick(skill)}
                                        className={`${getSkillColor(skill)} ${
                                            isActive ? "ring-2 ring-offset-2 ring-blue-300" : ""
                                        }`}
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
                {filteredProjects.map((project, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-neutral-800 shadow-lg rounded-2xl overflow-hidden transform transition hover:scale-[1.01]"
                    >
                        <div className="bg-gray-200 dark:bg-neutral-700 relative w-full h-48">
                            <Image
                                src={project.image}
                                alt={project.title}
                                fill // This makes the image fill the parent container
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Helps Next.js serve the right image size
                                className="object-cover" // objectFit is now a class
                            />
                        </div>

                        <div className="p-4">
                            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                                {project.title}
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 mb-2">
                                {project.description}
                            </p>

                            {/* Date Added */}
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                Date Added: {new Date(project.dateAdded).toLocaleDateString()}
                            </p>

                            {/* Project Skill Badges */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.skills.map((skill, i) => (
                                    <Badge key={i} className={getSkillColor(skill)}>
                                        {skill}
                                    </Badge>
                                ))}
                            </div>

                            <div className="flex items-center gap-4 mt-10">
                                <Link
                                    href={`/projects/${project.slug}`}
                                    className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg"
                                >
                                    View Details
                                </Link>
                                <Link
                                    href={project.githubLink}
                                    target="_blank"
                                    rel="noopener noreferrer" // Note: Next.js 13+ adds this automatically to target="_blank" links
                                className="bg-gray-600 text-white hover:bg-gray-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                GitHub
                            </Link>
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}
