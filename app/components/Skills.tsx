import React from "react";
import { FaCode, FaRobot, FaDatabase, FaCog, FaCloud, FaPaintBrush } from "react-icons/fa";

const Skills: React.FC = () => {
    return (
        <div className="h-[750px] flex relative justify-center text-black dark:text-white mt-10">
            {/* Main CSS grid container */}
            <div className="grid gap-10 grid-cols-6 grid-rows-5 w-full h-full max-w-[1200px] relative">
                {/* Header in the middle three columns */}
                <div className="col-start-1 col-span-1 row-start-1 row-span-1 flex justify-start items-end">
                    <h2 className="text-4xl font-medium text-gray-800 dark:text-gray-300">
                        Skills
                    </h2>
                </div>

                {/* Coding Languages Box */}
                <div className="col-start-1 col-span-2 row-start-2 row-span-2 bg-gray-200 dark:bg-neutral-800 rounded-lg shadow-lg p-4 hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-400 flex items-center">
                        <FaCode className="mr-2" /> Coding Languages
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-6">
                        <span className="bg-red-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
                            Python
                        </span>
                        <span className="bg-red-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
                            Java
                        </span>
                        <span className="bg-red-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
                            JavaScript
                        </span>
                        <span className="bg-red-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
                            TypeScript
                        </span>
                    </div>
                </div>

                {/* ML Frameworks Box */}
                <div className="col-start-3 col-span-2 row-start-2 row-span-2 bg-gray-200 dark:bg-neutral-800 rounded-lg shadow-lg p-4 hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-400 flex items-center">
                        <FaRobot className="mr-2" /> ML Frameworks
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-6">
                        <span className="bg-blue-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
                            TensorFlow
                        </span>
                        <span className="bg-blue-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
                            PyTorch
                        </span>
                        <span className="bg-blue-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
                            Keras
                        </span>
                        <span className="bg-blue-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
                            Scikit-learn
                        </span>
                    </div>
                </div>

                {/* Data Manipulation Box */}
                <div className="col-start-5 col-span-2 row-start-2 row-span-2 bg-gray-200 dark:bg-neutral-800 rounded-lg shadow-lg p-4 hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-400 flex items-center">
                        <FaDatabase className="mr-2" /> Data Manipulation
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-6">
                        <span className="bg-green-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
                            Pandas
                        </span>
                        <span className="bg-green-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
                            NumPy
                        </span>
                        <span className="bg-green-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
                            Matplotlib
                        </span>
                        <span className="bg-green-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
                            SciPy
                        </span>
                    </div>
                </div>

                {/* ML Concepts Box */}
                <div className="col-start-1 col-span-2 row-start-4 row-span-2 bg-gray-200 dark:bg-neutral-800 rounded-lg shadow-lg p-4 hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-400 flex items-center">
                        <FaCog className="mr-2" /> ML Concepts
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-6">
                        <span className="bg-yellow-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
                            Computer Vision
                        </span>
                        <span className="bg-yellow-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
                            Feature Engineering
                        </span>
                        <span className="bg-yellow-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
                            Hyperparameter Tuning
                        </span>
                        <span className="bg-yellow-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
                            Model Evaluation
                        </span>
                        <span className="bg-yellow-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
                            Gradient Boosting
                        </span>
                    </div>
                </div>

                {/* Model Deployment Box */}
                <div className="col-start-3 col-span-2 row-start-4 row-span-2 bg-gray-200 dark:bg-neutral-800 rounded-lg shadow-lg p-4 hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-400 flex items-center">
                        <FaCloud className="mr-2" /> Model Deployment
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-6">
                        <span className="bg-purple-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
                            Docker
                        </span>
                        <span className="bg-purple-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
                            Flask
                        </span>
                        <span className="bg-purple-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
                            Heroku
                        </span>
                        <span className="bg-purple-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
                            Git
                        </span>
                    </div>
                </div>

                {/* UI/UX Design Box */}
                <div className="col-start-5 col-span-2 row-start-4 row-span-2 bg-gray-200 dark:bg-neutral-800 rounded-lg shadow-lg p-4 hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-400 flex items-center">
                        <FaPaintBrush className="mr-2" /> UI/UX Design
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-6">
                        <span className="bg-teal-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
                            React
                        </span>
                        <span className="bg-teal-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
                            Next.js
                        </span>
                        <span className="bg-teal-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
                            TypeScript
                        </span>
                        <span className="bg-teal-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
                            Tailwind CSS
                        </span>
                        <span className="bg-teal-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">
                            Figma
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Skills;
