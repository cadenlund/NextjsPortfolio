// src/pages/index.tsx
import React from 'react';
import ProjectsGallery from "../components/ProjectsGallery";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Projects: React.FC = () => {
    return (
        <section className=" transition-colors duration-010">
            <Header />
            <ProjectsGallery/>
            <Footer />
        </section>
    );
};

export default Projects;
