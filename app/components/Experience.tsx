import React from "react";
import { FaGraduationCap, FaBriefcase } from "react-icons/fa";

const Timeline: React.FC = () => {
    return (
        <div className="w-full max-w-[1200px] mx-auto mt-32">
            {/* Right-Aligned Header */}
            <h2 className="text-4xl font-medium text-gray-800 dark:text-gray-300 mb-10 text-left">
                Education and Experience
            </h2>

            {/* Timeline */}
            <div className="relative grid gap-16">
                {/* Vertical Line */}
                <div className="absolute left-[17px] top-0 w-1 h-[480px] bg-gray-300 dark:bg-gray-600 translate-y-28"></div>

                {/* Element 1 */}
                <div className="relative flex items-center group">
                    {/* Icon */}
                    <div className="relative z-10 flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full transition-transform duration-300 group-hover:scale-110">
                        <FaBriefcase className="w-6 h-6" />
                    </div>

                    {/* Content Box */}
                    <div className="ml-8 bg-gray-200 dark:bg-neutral-800 rounded-lg shadow-lg p-6 w-full hover:shadow-xl hover:scale-[103%] transition-all duration-300">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            Episcopal High School
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">Baton Rouge, Louisiana | 2020-2023</p>
                        <p className="text-gray-700 dark:text-gray-300">
                            Took computer science and math courses
                        </p>
                        <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-gray-900 text-white text-sm font-medium px-3 py-1 rounded-full">
              Python
            </span>
                            <span className="bg-gray-900 text-white text-sm font-medium px-3 py-1 rounded-full">
              TensorFlow
            </span>
                            <span className="bg-gray-900 text-white text-sm font-medium px-3 py-1 rounded-full">
              React
            </span>
                        </div>
                    </div>
                </div>

                {/* Element 2 */}
                <div className="relative flex items-center group">
                    {/* Icon */}
                    <div className="relative z-10 flex items-center justify-center w-10 h-10 bg-yellow-500 text-white rounded-full transition-transform duration-300 group-hover:scale-110">
                        <FaBriefcase className="w-6 h-6" />
                    </div>

                    {/* Content Box */}
                    <div className="ml-8 bg-gray-200 dark:bg-neutral-800 rounded-lg shadow-lg p-6 w-full hover:shadow-xl hover:scale-[103%] transition-all duration-300">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            Louisiana State University | 2023-Current
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">Baton Rouge, Louisiana</p>
                        <p className="text-gray-700 dark:text-gray-300">
                            Pursuing bachelors in computer science with a focus in data analytics & machine learning
                        </p>
                        <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-gray-900 text-white text-sm font-medium px-3 py-1 rounded-full">
              JavaScript
            </span>
                            <span className="bg-gray-900 text-white text-sm font-medium px-3 py-1 rounded-full">
              Tailwind CSS
            </span>
                            <span className="bg-gray-900 text-white text-sm font-medium px-3 py-1 rounded-full">
              Next.js
            </span>
                        </div>
                    </div>
                </div>

                {/* Element 3 */}
                <div className="relative flex items-center group">
                    {/* Icon */}
                    <div className="relative z-10 flex items-center justify-center w-10 h-10 bg-red-500 text-white rounded-full transition-transform duration-300 group-hover:scale-110">
                        <FaGraduationCap className="w-6 h-6" />
                    </div>

                    {/* Content Box */}
                    <div className="ml-8 bg-gray-200 dark:bg-neutral-800 rounded-lg shadow-lg p-6 w-full hover:shadow-xl hover:scale-[103%] transition-all duration-300">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            Frockcandy Online
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">Baton Rouge, Louisiana</p>
                        <p className="text-gray-700 dark:text-gray-300">
                            Performed Seo optimization on Frockcandy online shopify boutique.
                            Performed keyword optimization, fixed technical errors in the website, and
                            launched optimized Google Ad campaigns.
                        </p>
                        <div className="flex flex-wrap gap-2 mt-4">
            <span className="bg-gray-900 text-white text-sm font-medium px-3 py-1 rounded-full">
              Java
            </span>
                            <span className="bg-gray-900 text-white text-sm font-medium px-3 py-1 rounded-full">
              Algorithms
            </span>
                            <span className="bg-gray-900 text-white text-sm font-medium px-3 py-1 rounded-full">
              Data Structures
            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Timeline;
