import React from "react"
import Image from "next/image"; // Import Next.js Image component
import SocialIcons from "./SocialIcons"; // Import the new component

const Hero: React.FC = () => {
    return (
        <div className="h-[400px] flex relative justify-center text-black dark:text-white">
            {/* Main CSS grid container */}
            <div className="grid gap-4 grid-cols-7 grid-rows-4 w-full h-full max-w-[1200px] relative">
                {/* Introductory Text */}
                <div className="col-start-1 col-span-4 row-start-1 row-span-2 flex flex-col justify-start">
                    <p className="text-xl text-gray-900 dark:text-gray-300 mb-2">Hi, I&apos;m Caden</p>
                    <h1 className="text-5xl font-bold mb-4">
                        Machine Learning Developer
                    </h1>
                    <p className="text-lg text-gray-900 dark:text-gray-300 mb-6">
                        I am a junior developer specializing in machine learning with Python and TensorFlow,
                        while also crafting responsive and user-friendly interfaces with React, Next.js, and Typescript.
                    </p>

                    {/* Social Icons Component */}
                    <SocialIcons />
                </div>

                {/* Next.js Image */}
                <div className="col-start-6 col-span-3 row-start-1 row-span-4 relative rounded-lg shadow-lg overflow-hidden">
                    <Image
                        src="/images/page/greyImage.jpg" // Replace with your image path
                        alt="Hero Image"
                        layout="fill" // Fill the container
                        objectFit="cover" // Ensure the image covers the area
                        className="rounded-lg" // Apply rounded corners
                    />
                </div>
            </div>
        </div>
    );
};

export default Hero;
