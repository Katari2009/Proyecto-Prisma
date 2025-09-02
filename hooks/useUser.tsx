import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { UserProfile, UserProgress, Level, Achievement } from '../types';
import { GAMIFICATION_CONFIG, getLevelForXp } from '../gamification/config';
import { MODULES } from '../constants';


export interface GamificationEvent {
    id: string;
    type: 'level-up' | 'achievement';
    payload: Level | Achievement;
}

interface UserContextType {
    user: UserProfile | null;
    progress: UserProgress;
    isLoading: boolean;
    gamificationEvents: GamificationEvent[];
    saveUser: (profile: UserProfile) => void;
    updateProgress: (moduleId: string, activityId: string, data: { completed: boolean; score?: number; answer?: any }) => void;
    clearData: () => void;
    dismissGamificationEvent: (id: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [progress, setProgress] = useState<UserProgress>({});
    const [isLoading, setIsLoading] = useState(true);
    const [gamificationEvents, setGamificationEvents] = useState<GamificationEvent[]>([]);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('userProfile');
            const storedProgress = localStorage.getItem('userProgress');
            if (storedUser) {
                // Ensure loaded user has gamification fields
                const parsedUser = JSON.parse(storedUser);
                setUser({
                    xp: 0,
                    achievements: [],
                    ...parsedUser
                });
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
    
    const dismissGamificationEvent = (id: string) => {
        setGamificationEvents(prev => prev.filter(event => event.id !== id));
    };

    const updateProgress = useCallback((moduleId: string, activityId: string, data: { completed: boolean; score?: number; answer?: any }) => {
        const isAlreadyCompleted = progress[moduleId]?.[activityId]?.completed;

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

            // --- Gamification Logic ---
            if (user && data.completed && !isAlreadyCompleted) {
                const newXp = user.xp + GAMIFICATION_CONFIG.POINTS_PER_ACTIVITY;
                const oldLevel = getLevelForXp(user.xp);
                const newLevel = getLevelForXp(newXp);

                // Check for Level Up
                if (newLevel.name !== oldLevel.name) {
                    setGamificationEvents(prev => [...prev, {
                        id: `level-${Date.now()}`,
                        type: 'level-up',
                        payload: newLevel
                    }]);
                }

                // Check for new Achievements
                const newlyUnlockedAchievements: Achievement[] = [];
                GAMIFICATION_CONFIG.ACHIEVEMENTS.forEach(achievement => {
                    const isAlreadyUnlocked = user.achievements.includes(achievement.id);
                    if (!isAlreadyUnlocked && achievement.condition(newProgress, MODULES)) {
                        newlyUnlockedAchievements.push(achievement);
                        setGamificationEvents(prev => [...prev, {
                            id: `achieve-${achievement.id}-${Date.now()}`,
                            type: 'achievement',
                            payload: achievement
                        }]);
                    }
                });

                const updatedUser = {
                    ...user,
                    xp: newXp,
                    achievements: [...user.achievements, ...newlyUnlockedAchievements.map(a => a.id)]
                };
                
                setUser(updatedUser);
                localStorage.setItem('userProfile', JSON.stringify(updatedUser));
            }
            // --- End Gamification Logic ---

            return newProgress;
        });
    }, [user, progress]);
    
    const clearData = useCallback(() => {
        const resetUser = user ? { ...user, xp: 0, achievements: [] } : null;
        if (resetUser) {
             setUser(resetUser);
        } else {
            setUser(null);
        }
       
        setProgress({});
        try {
            if (resetUser) {
                localStorage.setItem('userProfile', JSON.stringify(resetUser));
            } else {
                 localStorage.removeItem('userProfile');
            }
            localStorage.removeItem('userProgress');
        } catch (error) {
             console.error("Failed to clear localStorage", error);
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, progress, isLoading, saveUser, updateProgress, clearData, gamificationEvents, dismissGamificationEvent }}>
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