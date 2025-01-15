import React from "react";
import SocialIcons from "./SocialIcons";
import 'react-tooltip/dist/react-tooltip.css';

const Footer: React.FC = () => {
    return (
        <footer className="h-[200px] mb-10 mt-10 flex flex-col items-center justify-center text-gray-800 dark:text-gray-300">

            <SocialIcons />
            <p className="text-sm mt-4">
                © 2025 Caden Lund. All rights reserved.
            </p>
        </footer>
    );
};

export default Footer;
