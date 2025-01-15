import React from 'react';
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Certifications from "./components/Certifications";
import FeaturedProjects from "./components/FeaturedProjects";

const Home: React.FC = () => {
    return (
        <section className=" mt-24 ">
            <Hero />
            <Skills />
            <Experience />
            <Certifications />
            <FeaturedProjects />
        </section>
    );
};

export default Home;