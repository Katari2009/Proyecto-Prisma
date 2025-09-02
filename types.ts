// FIX: Import React to make React types available in this file.
import React from 'react';

// --- Gamification Types ---
export interface Level {
    name: string;
    minXp: number;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    condition: (progress: UserProgress, modules: Module[]) => boolean;
}
// --------------------------


export interface UserProfile {
    name: string;
    course: string;
    avatar?: string; // Base64 string for the image
    xp: number; // Experience Points
    achievements: string[]; // Array of achievement IDs
}

export interface MultipleChoiceQuestion {
    question: string;
    options: string[];
    answer: string;
    explanation: string; // Added to provide feedback on the correct answer
}

export interface MatchingItem {
    id: string;
    text: string;
}

export interface MatchingTarget {
    id: string;
    text: string;
}

// NEW: Define a structure for a single case in a matching activity
export interface MatchingCase {
    id: string;
    description: string;
    items: MatchingItem[];
    correctMapping: { [itemId: string]: string };
}

export interface ActivityContentMap {
    'multiple-choice': {
        questions: MultipleChoiceQuestion[];
    };
    'drag-drop': {
        cases: MatchingCase[]; // Now an array of cases
        targets: MatchingTarget[]; // Targets are shared across cases
    };
    'open-question': {
        prompt: string;
    };
}

export type ActivityType = keyof ActivityContentMap;

// Update the main Activity type to be generic
export interface Activity<T extends ActivityType = any> {
    id: string;
    title: string;
    type: T;
    description: string;
    content: ActivityContentMap[T];
}


export interface Module {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    activities: Activity[];
}

export interface UserProgress {
    [moduleId: string]: {
        [activityId: string]: {
            completed: boolean;
            score?: number;
            answer?: any;
        };
    };
}