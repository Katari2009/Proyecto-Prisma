
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { UserProfile, UserProgress } from '../types';

interface UserContextType {
    user: UserProfile | null;
    progress: UserProgress;
    isLoading: boolean;
    saveUser: (profile: UserProfile) => void;
    updateProgress: (moduleId: string, activityId: string, data: { completed: boolean; score?: number; answer?: any }) => void;
    clearData: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [progress, setProgress] = useState<UserProgress>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('userProfile');
            const storedProgress = localStorage.getItem('userProgress');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            if (storedProgress) {
                setProgress(JSON.parse(storedProgress));
            }
        } catch (error) {
            console.error("Failed to load data from localStorage", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const saveUser = useCallback((profile: UserProfile) => {
        setUser(profile);
        try {
            localStorage.setItem('userProfile', JSON.stringify(profile));
        } catch (error) {
            console.error("Failed to save user profile to localStorage", error);
        }
    }, []);

    const updateProgress = useCallback((moduleId: string, activityId: string, data: { completed: boolean; score?: number; answer?: any }) => {
        setProgress(prevProgress => {
            const newProgress = {
                ...prevProgress,
                [moduleId]: {
                    ...prevProgress[moduleId],
                    [activityId]: data,
                },
            };
            try {
                localStorage.setItem('userProgress', JSON.stringify(newProgress));
            } catch (error) {
                console.error("Failed to save progress to localStorage", error);
            }
            return newProgress;
        });
    }, []);
    
    const clearData = useCallback(() => {
        setUser(null);
        setProgress({});
        try {
            localStorage.removeItem('userProfile');
            localStorage.removeItem('userProgress');
        } catch (error) {
             console.error("Failed to clear localStorage", error);
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, progress, isLoading, saveUser, updateProgress, clearData }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};