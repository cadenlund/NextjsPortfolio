import React from "react";
import { FaGraduationCap, FaBriefcase } from "react-icons/fa";

const TimelineItem: React.FC<{
    icon: React.ReactNode;
    iconBgColor: string;
    title: string;
    date: string;
    description: string;
    children?: React.ReactNode;
}> = ({ icon, iconBgColor, title, date, description, children }) => (
    <div className="relative flex items-center group">
        <div className={`relative z-10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:scale-110 ${iconBgColor}`}>
            {icon}
        </div>

        <div className="ml-6 flex-1 rounded-lg bg-gray-200 p-6 shadow-lg transition-all duration-300 hover:scale-[102%] hover:shadow-xl dark:bg-neutral-800">
            <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-200">
                {title}
            </h3>
            <p className="mb-4 text-gray-600 dark:text-gray-400">{date}</p>
            <p className="text-gray-700 dark:text-gray-300">
                {description}
            </p>
            {children && <div className="mt-4 flex flex-wrap gap-2">{children}</div>}
        </div>
    </div>
);

const Badge: React.FC<{ children: string }> = ({ children }) => (
    <span className="rounded-full bg-gray-900 px-3 py-1 text-sm font-medium text-white">
        {children}
    </span>
);

const Timeline: React.FC = () => {
    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
            <div className="mb-12 text-center md:text-left">
                <h2 className="text-4xl font-medium text-gray-800 dark:text-gray-300">
                    Education & Experience
                </h2>
            </div>

            {/* This is the main container for the timeline items */}
            <div className="relative flex flex-col gap-12">
                {/* This single line element works for ALL screen sizes */}
                <div className="absolute left-5 top-24 bottom-28 w-px bg-gray-400 dark:bg-gray-600" aria-hidden="true"></div>

                <TimelineItem
                    icon={<FaGraduationCap className="h-6 w-6" />}
                    iconBgColor="bg-blue-600"
                    title="Episcopal High School"
                    date="Baton Rouge, LA | 2020 - 2023"
                    description="Graduated with a focus on computer science and advanced mathematics."
                >
                    <Badge>Python</Badge>
                    <Badge>Statistical Modeling</Badge>
                    <Badge>Calculus</Badge>
                </TimelineItem>

                <TimelineItem
                    icon={<FaGraduationCap className="h-6 w-6" />}
                    iconBgColor="bg-yellow-500"
                    title="Louisiana State University"
                    date="Baton Rouge, LA | 2023 - Present"
                    description="Pursuing a Bachelor's in Computer Science with a concentration in Data Analytics & Machine Learning."
                >
                    <Badge>Data Structures</Badge>
                    <Badge>Machine Learning</Badge>
                    <Badge>Linear Algebra</Badge>
                    <Badge>Algorithms</Badge>
                </TimelineItem>

                <TimelineItem
                    icon={<FaBriefcase className="h-5 w-5" />}
                    iconBgColor="bg-red-500"
                    title="Indepedent Website Developer & Digital Marketer"
                    date="Baton Rouge, LA | 2022 - Present"
                    description="Built fast websites for clients and performed digital marketing services including SEO, Google Ads, and data analytics."
                >
                    <Badge>React</Badge>
                    <Badge>TypeScript</Badge>
                    <Badge>Next.js</Badge>
                    <Badge>SEO</Badge>
                    <Badge>Google Ads</Badge>
                    <Badge>Data Analytics</Badge>
                </TimelineItem>
            </div>
        </div>
    );
};

export default Timeline;