import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

const SplashScreen = ({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 3500); // 3.5 seconds for a premium feel
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[#0052CC] overflow-hidden"
        >
            {/* Background DNA Graphics (Subtle animated gradients/shapes) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, 0],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/4 -right-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_70%)]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        rotate: [0, -10, 0],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-1/4 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_80%)]"
                />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    {/* Using our Logo component with forced dark/white mode variant */}
                    <div className="dark">
                        <Logo size="lg" />
                    </div>
                </motion.div>

                <div className="mt-8 text-center space-y-2">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-white text-3xl font-black tracking-tighter uppercase"
                    >
                        Bienvenido
                    </motion.h1>
                    <motion.p
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="text-blue-100/60 text-[10px] font-bold tracking-[0.3em] uppercase"
                    >
                        Pedidos Internos · v1.0
                    </motion.p>
                </div>

                {/* Loading indicator */}
                <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 120, opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1.5, ease: "easeInOut" }}
                    className="mt-12 h-1 bg-white/20 rounded-full overflow-hidden"
                >
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "0%" }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-full h-full bg-white"
                    />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default SplashScreen;
