import React from 'react';
import { useTheme } from '../context/ThemeContext';
import logoWhite from '../assets/logo-white.png';
import logoColor from '../assets/logo-color.png';

const Logo = ({ size = "md" }) => {
    const { isDark } = useTheme();
    const heightClass = size === "lg" ? "h-24" : size === "sm" ? "h-8" : "h-12";
    const src = isDark ? logoWhite : logoColor;

    return (
        <img
            src={src}
            alt="Pedidos Internos"
            className={`${heightClass} w-auto object-contain transition-opacity duration-300`}
        />
    );
};

export default Logo;
