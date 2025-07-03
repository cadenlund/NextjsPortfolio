import React from "react";
import { FaCode, FaRobot, FaDatabase, FaCog, FaCloud, FaPaintBrush } from "react-icons/fa";

const Skills: React.FC = () => {
    return (
        // The change is here 👇: The container classes now match your other section
        <div className="mx-auto max-w-7xl px-4 py-16 text-black dark:text-white sm:px-6 lg:px-8 lg:min-h-[700px]">

            <div className="text-left mb-12">
                <h2 className="text-4xl font-medium text-gray-800 dark:text-gray-300">
                    Skills
                </h2>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 grid-auto-rows-fr">

                {/* Card 1 */}
                <div className="bg-gray-200 dark:bg-neutral-800 rounded-lg shadow-lg p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 min-h-[150px] md:min-h-[220px]">
                    <h3 className="text-xl font-medium text-gray-700 dark:text-gray-400 flex items-center mb-6">
                        <FaCode className="mr-3" /> Python
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        <span
                            className="bg-red-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">Pandas</span>
                        <span
                            className="bg-red-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">Numpy</span>
                        <span
                            className="bg-red-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">AlphaLens</span>
                        <span
                            className="bg-red-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">TensorFlow</span>
                        <span
                            className="bg-red-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">Torch</span>
                        <span
                            className="bg-red-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">Scikit-learn</span>
                        <span
                            className="bg-red-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">Scipy</span>
                    </div>
                </div>

                {/* Card 2 */}
                <div
                    className="bg-gray-200 dark:bg-neutral-800 rounded-lg shadow-lg p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 min-h-[150px] md:min-h-[220px]">
                    <h3 className="text-xl font-medium text-gray-700 dark:text-gray-400 flex items-center mb-6">
                        <FaRobot className="mr-3" /> C++
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        <span className="bg-blue-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">Template Metaprogramming</span>
                        <span
                            className="bg-blue-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">Multithreading</span>
                        <span className="bg-blue-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">Eigen Library</span>
                        <span className="bg-blue-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">Move Semantics</span>
                        <span className="bg-blue-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">Cache-aware code</span>
                        <span className="bg-blue-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">Compile-time code</span>
                    </div>
                </div>

                {/* Card 3 */}
                <div
                    className="bg-gray-200 dark:bg-neutral-800 rounded-lg shadow-lg p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 min-h-[150px] md:min-h-[220px]">
                    <h3 className="text-xl font-medium text-gray-700 dark:text-gray-400 flex items-center mb-6">
                        <FaDatabase className="mr-3" /> ML and Statistical Modeling
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        <span className="bg-green-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">Tree based models</span>
                        <span className="bg-green-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">Gradient boosting</span>
                        <span
                            className="bg-green-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">Transformers</span>
                        <span className="bg-green-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">Ridge/Lasso Regression</span>
                        <span className="bg-green-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">Bayesian ML</span>
                        <span className="bg-green-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">Feature Engineering</span>
                    </div>
                </div>

                {/* Card 4 */}
                <div
                    className="bg-gray-200 dark:bg-neutral-800 rounded-lg shadow-lg p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 min-h-[150px] md:min-h-[220px]">
                    <h3 className="text-xl font-medium text-gray-700 dark:text-gray-400 flex items-center mb-6">
                        <FaCog className="mr-3" /> Quantitative Finance
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        <span className="bg-yellow-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">Computer Vision</span>
                        <span className="bg-yellow-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">Feature Engineering</span>
                        <span className="bg-yellow-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">Model Evaluation</span>
                    </div>
                </div>

                {/* Card 5 */}
                <div className="bg-gray-200 dark:bg-neutral-800 rounded-lg shadow-lg p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 min-h-[150px] md:min-h-[220px]">
                    <h3 className="text-xl font-medium text-gray-700 dark:text-gray-400 flex items-center mb-6">
                        <FaCloud className="mr-3" /> Comp Sci Fundamentals
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        <span className="bg-purple-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">Docker</span>
                        <span className="bg-purple-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">Flask</span>
                        <span className="bg-purple-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">Heroku</span>
                        <span className="bg-purple-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">Git</span>
                    </div>
                </div>

                {/* Card 6 */}
                <div className="bg-gray-200 dark:bg-neutral-800 rounded-lg shadow-lg p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 min-h-[150px] md:min-h-[220px]">
                    <h3 className="text-xl font-medium text-gray-700 dark:text-gray-400 flex items-center mb-6">
                        <FaPaintBrush className="mr-3" /> Web/Software Dev
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        <span className="bg-teal-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">React</span>
                        <span className="bg-teal-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">Next.js</span>
                        <span className="bg-teal-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">Tailwind CSS</span>
                        <span className="bg-teal-600 text-white text-sm font-medium px-2.5 py-0.5 rounded-full">Figma</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Skills;