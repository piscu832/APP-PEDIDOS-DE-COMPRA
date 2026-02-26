import React from 'react';
import { useTheme } from '../context/ThemeContext';

// logo-blanco.svg → used on DARK backgrounds (dark mode)
// logo-color.svg  → used on LIGHT backgrounds (light mode)
import logoDark from '../assets/logo-blanco.svg';
import logoLight from '../assets/logo-color.svg';

const Logo = ({ size = "md" }) => {
    const { isDark } = useTheme();

    const heightClass = size === "lg" ? "h-16" : size === "sm" ? "h-6" : "h-10";
    const src = isDark ? logoDark : logoLight;

    return (
        <img
            src={src}
            alt="Villalba Medical Systems"
            className={`${heightClass} w-auto object-contain transition-opacity duration-300`}
        />
    );
};

export default Logo;
