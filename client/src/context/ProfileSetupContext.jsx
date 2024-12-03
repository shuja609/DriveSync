import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import profileService from '../services/profileService';

const ProfileSetupContext = createContext(null);

export const ProfileSetupProvider = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [totalSteps, setTotalSteps] = useState(5);
    const [progress, setProgress] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadProgress();
    }, []);

    const loadProgress = async () => {
        try {
            const data = await profileService.getSetupProgress();
            setCurrentStep(data.currentStep);
            setTotalSteps(data.totalSteps);
            setProgress(data.progress);
        } catch (error) {
            console.error('Error loading setup progress:', error);
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(prev => prev + 1);
            navigate(`/setup/step${currentStep + 1}`);
        } else {
            navigate('/');
        }
    };

    const skipStep = async () => {
        try {
            await profileService.skipStep(currentStep);
            nextStep();
        } catch (error) {
            console.error('Error skipping step:', error);
        }
    };

    return (
        <ProfileSetupContext.Provider value={{
            currentStep,
            totalSteps,
            progress,
            loading,
            nextStep,
            skipStep,
            loadProgress
        }}>
            <Outlet />
        </ProfileSetupContext.Provider>
    );
};

export const useProfileSetup = () => useContext(ProfileSetupContext); 