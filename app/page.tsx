import React from 'react';
import Hero from "./components/Hero";
import Skills from "./components/Skills";

const Home: React.FC = () => {
    return (
        <section className=" mt-24 ">
            <Hero />
            <Skills />
        </section>
    );
};

export default Home;