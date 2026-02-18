"use client";

import React from 'react';
import { motion } from 'framer-motion';
import AppleLogo from './AppleLogo';

const BootShell: React.FC = () => {
    return (
        <div className="h-screen w-full bg-black flex flex-col items-center justify-center gap-12 text-white">
            <AppleLogo size={80} className="md:w-[100px] md:h-[100px]" />
            <div className="w-32 md:w-48 h-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="h-full bg-white"
                />
            </div>
        </div>
    );
};

export default BootShell;
