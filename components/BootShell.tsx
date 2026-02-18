"use client";

import React from 'react';
import { motion } from 'framer-motion';
import AppleLogo from './AppleLogo';

const BootShell: React.FC = () => {
    return (
        <div className="h-screen w-full bg-black flex flex-col items-center justify-center gap-12 text-white">
            <AppleLogo size={100} />
            <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
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
