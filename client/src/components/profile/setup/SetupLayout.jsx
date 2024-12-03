import React from 'react';
import { motion } from 'framer-motion';

const SetupLayout = ({ children, currentStep, totalSteps, title, subtitle }) => {
    return (
        <div className="min-h-screen bg-background-dark">
            <div className="max-w-4xl mx-auto px-4 py-16">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="h-2 bg-background-light rounded-full">
                        <motion.div
                            className="h-full bg-primary-light rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                    <div className="mt-2 text-white text-sm text-right">
                        Step {currentStep} of {totalSteps}
                    </div>
                </div>

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-3xl font-bold text-white mb-2">
                        {title}
                    </h1>
                    {subtitle && (
                        <p className="text-white">
                            {subtitle}
                        </p>
                    )}
                </motion.div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {children}
                </motion.div>
            </div>
        </div>
    );
};

export default SetupLayout; 