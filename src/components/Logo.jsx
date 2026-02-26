import React from 'react';

const Logo = ({ size = "md" }) => (
    <div className={`relative flex items-center justify-center ${size === "lg" ? "w-16 h-16" : "w-10 h-10"}`}>
        <svg className="absolute inset-0 w-full h-full fill-slate-900 dark:fill-white" viewBox="0 0 100 100">
            <path d="M50 15 L85 85 L15 85 Z"></path>
        </svg>
        <span className={`relative font-black text-white dark:text-background-dark mt-2 ${size === "lg" ? "text-xl" : "text-[10px]"}`}>V</span>
    </div>
);

export default Logo;
