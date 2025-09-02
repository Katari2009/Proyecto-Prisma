import type { Level, Achievement, UserProgress, Module } from '../types';
import { 
    BronzeMedalIcon,
    SilverMedalIcon,
    GoldMedalIcon,
    DiamondMedalIcon,
    FirstStepIcon,
    ModuleCompleteIcon,
    PerfectScoreIcon,
    PaesProIcon
} from '../components/icons/Icons';

export const GAMIFICATION_CONFIG = {
    POINTS_PER_ACTIVITY: 100,
    
    LEVELS: [
        { name: 'Principiante', minXp: 0, icon: BronzeMedalIcon, color: 'text-yellow-600' },
        { name: 'Intermedio', minXp: 250, icon: SilverMedalIcon, color: 'text-slate-400' },
        { name: 'Avanzado', minXp: 750, icon: GoldMedalIcon, color: 'text-yellow-400' },
        { name: 'Experto', minXp: 1500, icon: DiamondMedalIcon, color: 'text-sky-300' },
    ] as Level[],

    ACHIEVEMENTS: [
        {
            id: 'first-step',
            name: 'Primer Paso',
            description: 'Completa tu primera actividad.',
            icon: FirstStepIcon,
            condition: (progress: UserProgress) => Object.keys(progress).length > 0,
        },
        {
            id: 'module-complete',
            name: 'Completista de Módulo',
            description: 'Completa todas las actividades de cualquier módulo.',
            icon: ModuleCompleteIcon,
            condition: (progress: UserProgress, modules: Module[]) => {
                return modules.some(module => 
                    module.activities.length > 0 &&
                    module.activities.every(activity => progress[module.id]?.[activity.id]?.completed)
                );
            },
        },
        {
            id: 'perfect-score',
            name: 'Puntaje Perfecto',
            description: 'Obtén un 100% en cualquier cuestionario.',
            icon: PerfectScoreIcon,
            condition: (progress: UserProgress) => {
                return Object.values(progress).some(moduleProgress => 
                    Object.values(moduleProgress).some(activity => activity.score === 100)
                );
            },
        },
        {
            id: 'paes-pro',
            name: 'Profesional PAES',
            description: 'Completa el módulo de ensayo PAES.',
            icon: PaesProIcon,
            condition: (progress: UserProgress, modules: Module[]) => {
                const paesModule = modules.find(m => m.id === 'paes-m1');
                if (!paesModule) return false;
                return paesModule.activities.every(activity => progress[paesModule.id]?.[activity.id]?.completed);
            },
        },
    ] as Achievement[],
};

export const getLevelForXp = (xp: number): Level => {
    return GAMIFICATION_CONFIG.LEVELS.slice().reverse().find(level => xp >= level.minXp) || GAMIFICATION_CONFIG.LEVELS[0];
};