import React from "react";
import Image from "next/image";
import SocialIcons from "./SocialIcons";

const Hero: React.FC = () => {
    return (
        <div className="flex justify-center px-4 py-8 text-black dark:text-white mt-8 md:mt-20">
            <div className="flex flex-col items-center w-full max-w-[1200px] md:grid md:grid-cols-12 md:gap-8">

                <div className="flex flex-col items-center text-center md:col-span-7 md:items-start md:text-left">
                    <p className="text-xl text-gray-900 dark:text-gray-300 mb-2">Hi, I&apos;m Caden</p>
                    <h1 className="text-4xl font-bold mb-4 md:text-5xl">
                        Quantitative Researcher
                    </h1>
                    <p className="text-lg text-gray-900 dark:text-gray-300 mb-2">
                        I am a junior developer specializing in quantitative research and development,
                        currently pursuing alpha research in futures, leveraging granular market-by-order (MBO)
                        data to build and test advanced statistical models for predictive signaling.
                    </p>
                    <SocialIcons />
                </div>

                <div className="relative w-full max-w-[280px] mt-8 overflow-hidden rounded-lg shadow-lg aspect-[5/6] md:aspect-[3/4] md:col-start-9 md:col-span-4 md:max-w-none md:mt-0">
                    <Image
                        src="/images/page/greyImage.jpg"
                        alt="Hero Image"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                    />
                </div>
            </div>
        </div>
    );
};

export default Hero;
