import React from 'react';
import { useUser } from '../hooks/useUser';
import { MODULES } from '../constants';
import { GAMIFICATION_CONFIG, getLevelForXp } from '../gamification/config';
import Card from './common/Card';
import ProgressBar from './common/ProgressBar';
import { AvatarCompanion } from './icons/Icons';

interface DashboardProps {
    onSelectModule: (moduleId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectModule }) => {
    const { user, progress } = useUser();

    const getModuleProgress = (moduleId: string) => {
        const module = MODULES.find(m => m.id === moduleId);
        if (!module) return 0;

        const totalActivities = module.activities.length;
        if (totalActivities === 0) return 0;
        
        const completedActivities = progress[moduleId] ? Object.values(progress[moduleId]).filter(p => p.completed).length : 0;
        return Math.round((completedActivities / totalActivities) * 100);
    };

    // Gamification data
    const currentLevel = user ? getLevelForXp(user.xp) : GAMIFICATION_CONFIG.LEVELS[0];
    const nextLevel = GAMIFICATION_CONFIG.LEVELS.find(l => l.minXp > (user?.xp || 0));
    const xpForNextLevel = nextLevel ? nextLevel.minXp - currentLevel.minXp : 0;
    const xpProgress = user ? user.xp - currentLevel.minXp : 0;
    const levelProgressPercent = xpForNextLevel > 0 ? Math.round((xpProgress / xpForNextLevel) * 100) : 100;

    const unlockedAchievements = GAMIFICATION_CONFIG.ACHIEVEMENTS.filter(ach => user?.achievements.includes(ach.id));

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="flex items-center gap-4 bg-slate-900/20 backdrop-blur-xl border border-white/10 rounded-3xl p-4">
                <AvatarCompanion className="w-20 h-20 flex-shrink-0" />
                <div className="flex-grow">
                    <h2 className="text-2xl md:text-3xl font-bold text-white">Hola, {user?.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                        <currentLevel.icon className={`w-6 h-6 ${currentLevel.color}`} />
                        <span className={`font-bold text-lg ${currentLevel.color}`}>{currentLevel.name}</span>
                    </div>
                </div>
            </header>
            
            <Card>
                <h3 className="text-xl font-bold mb-2 text-white">Mi Progreso</h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center text-sm mb-1 font-semibold">
                            <span className="text-slate-300">Nivel: {currentLevel.name}</span>
                            <span className="text-white">{user?.xp || 0} XP</span>
                        </div>
                        <ProgressBar progress={levelProgressPercent} />
                        {nextLevel && <p className="text-right text-xs text-slate-400 mt-1">{nextLevel.minXp - (user?.xp || 0)} XP para el siguiente nivel</p>}
                    </div>

                    <div>
                        <h4 className="font-semibold mb-2 text-slate-200">Insignias Desbloqueadas</h4>
                        <div className="flex flex-wrap gap-4">
                            {unlockedAchievements.length > 0 ? (
                                unlockedAchievements.map(ach => (
                                    <div key={ach.id} className="group relative text-center">
                                        <div className="bg-slate-800/50 p-3 rounded-full border-2 border-amber-400/50">
                                            <ach.icon className="w-8 h-8 text-amber-400" />
                                        </div>
                                        <div className="absolute bottom-full mb-2 w-max max-w-xs bg-slate-900 text-white text-xs rounded-lg py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none left-1/2 -translate-x-1/2">
                                            <p className="font-bold">{ach.name}</p>
                                            <p>{ach.description}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-400 italic">¡Completa actividades para ganar insignias!</p>
                            )}
                        </div>
                    </div>
                </div>
            </Card>

            <section>
                <h3 className="text-2xl font-bold mb-4 text-white">Módulos de Aprendizaje</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {MODULES.map(module => (
                        <div key={module.id} onClick={() => onSelectModule(module.id)} className="h-full cursor-pointer">
                            <Card isHoverable={true} className="h-full">
                                <div className="flex flex-col h-full">
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="p-3 bg-sky-500/20 rounded-xl">
                                                <module.icon className="w-6 h-6 text-sky-400" />
                                            </div>
                                            <h4 className="text-lg font-bold text-white">{module.title}</h4>
                                        </div>
                                        <p className="text-sm text-slate-300 mb-4">{module.description}</p>
                                    </div>
                                    <div>
                                        <ProgressBar progress={getModuleProgress(module.id)} />
                                    </div>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;