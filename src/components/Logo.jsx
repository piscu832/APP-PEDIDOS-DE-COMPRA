import React from 'react';
import logoApp from '../assets/logo-app.png';

const Logo = ({ size = "md" }) => {
    const heightClass = size === "lg" ? "h-24" : size === "sm" ? "h-8" : "h-12";

    return (
        <img
            src={logoApp}
            alt="Villalba Medical Systems"
            className={`${heightClass} w-auto object-contain transition-opacity duration-300`}
        />
    );
};

export default Logo;
