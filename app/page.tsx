import React from 'react';
import Hero from "./components/Hero";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Certifications from "./components/Certifications";
import FeaturedProjects from "./components/FeaturedProjects";
import Header from "./components/Header";
import Footer from "./components/Footer";

const Home: React.FC = () => {
    return (
        <section className=''>
            <Header />
            <Hero />
            <Skills />
            <Experience />
            <Certifications />
            <FeaturedProjects />
            <Footer />
        </section>
    );
};

export default Home;