import React from 'react';
import { MODULES } from '../constants';
import { useUser } from '../hooks/useUser';
import Card from './common/Card';
import { ArrowLeftIcon, CheckCircleIcon } from './icons/Icons';

interface ModuleViewProps {
    moduleId: string;
    onBack: () => void;
    onSelectActivity: (activityId: string) => void;
}

const ModuleView: React.FC<ModuleViewProps> = ({ moduleId, onBack, onSelectActivity }) => {
    const { progress } = useUser();
    const module = MODULES.find(m => m.id === moduleId);

    if (!module) {
        return (
            <div className="text-center p-8">
                <p className="text-xl mb-4">Módulo no encontrado.</p>
                <button onClick={onBack} className="bg-sky-500 text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                    Volver
                </button>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <header className="mb-8">
                <button onClick={onBack} className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-4 font-semibold">
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span>Volver a Módulos</span>
                </button>
                <div className="flex items-start md:items-center gap-4 flex-col md:flex-row">
                    <div className="p-4 bg-sky-500/20 rounded-2xl">
                        <module.icon className="w-10 h-10 text-sky-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white">{module.title}</h2>
                        <p className="text-slate-300 mt-1">{module.description}</p>
                    </div>
                </div>
            </header>

            <section>
                <h3 className="text-2xl font-bold mb-4 text-white">Actividades</h3>
                <div className="space-y-4">
                    {module.activities.map((activity, index) => {
                        const isCompleted = progress[module.id]?.[activity.id]?.completed;
                        return (
                            <div key={activity.id} onClick={() => onSelectActivity(activity.id)}>
                                <Card isHoverable={true} className="cursor-pointer">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="text-4xl font-bold text-slate-700">{String(index + 1).padStart(2, '0')}</div>
                                            <div>
                                                <h4 className="text-lg font-bold text-white">{activity.title}</h4>
                                                <p className="text-sm text-slate-400">{activity.description}</p>
                                            </div>
                                        </div>
                                        {isCompleted && (
                                            <div className="flex-shrink-0 ml-4 transform-gpu transition-transform duration-300 group-hover:scale-110">
                                                <CheckCircleIcon className="w-10 h-10 text-green-400" />
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
};

export default ModuleView;