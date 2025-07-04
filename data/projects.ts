export interface Project {
    slug: string;
    title: string;
    description: string;
    skills: string[];
    image: string;
    githubLink: string;
    dateAdded: string;
    details: string;
    primaryActionText: string;
    primaryActionLink: string;
    isFeatured: boolean; // <-- The key to our new system!
}

export const projectsData: Project[] = [
    {
        slug: "Long-short-portfolio",
        title: "Alpha Factor Long-short Strategy",
        description: "Created alpha factors, evaluated them with Alphalens, and created a long short strategy.",
        skills: ["Python", "Pandas", "Alphalens", "VectorBT", "Quant Finance"],
        image: "/images/longshortportfolioproject/longshortportfoliocover.png",
        githubLink: "#",
        dateAdded: "2025-05-18",
        details: "A deep dive into creating and backtesting alpha factors for a long-short equity strategy.",
        primaryActionText: "View Report",
        primaryActionLink: "/projects/Long-short-portfolio",
        isFeatured: true,
    },
    {
        slug: "cadenlund-portfolio",
        title: "Cadenlund.com Website",
        description: "My personal portfolio built with Next.js, showcasing skills and projects.",
        skills: ["TypeScript", "Tailwind CSS", "React", "Next.js", "UI/UX"],
        image: "/images/cadenlundsite/mySite.png",
        githubLink: "https://github.com/cadenlund/NextjsPortfolio",
        dateAdded: "2025-01-15",
        details: "My personal portfolio website built with Next.js and Tailwind CSS, featuring a modern design and responsive layout.",
        primaryActionText: "View Report",
        primaryActionLink: "https://github.com/cadenlund/NextjsPortfolio",
        isFeatured: false, // <-- Set this to true to feature it
    },
    {
        slug: "Capitol-Companies",
        title: "Capitol Companies Website",
        description: "Front end website for Capitol Companies, a concrete and construction company.",
        skills: ["JavaScript", "React", "Next.js", "Tailwind CSS"],
        image: "/images/capitolcompanies/og-image.jpg",
        githubLink: "",
        dateAdded: "2025-07-03",
        details: "Details for another project.",
        primaryActionText: "View Site",
        primaryActionLink: "https://www.capitolcompanies.org",
        isFeatured: true, // <-- This one will not appear in "Featured"
    },
];