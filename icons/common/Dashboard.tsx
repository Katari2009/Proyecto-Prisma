import React from 'react';
import { useUser } from '../hooks/useUser';
import { MODULES } from '../constants';
import Card from './common/Card';
import ProgressBar from './common/ProgressBar';
import { UserCircleIcon } from './icons/Icons';

interface DashboardProps {
    onSelectModule: (moduleId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectModule }) => {
    const { user, progress } = useUser();

    const calculateOverallProgress = () => {
        const totalActivities = MODULES.reduce((acc, module) => acc + module.activities.length, 0);
        if (totalActivities === 0) return 0;

        // FIX: Explicitly cast `p` to `any` to resolve a TypeScript type inference issue.
        const completedActivities = Object.values(progress).flatMap(Object.values).filter((p: any) => p.completed).length;
        return Math.round((completedActivities / totalActivities) * 100);
    };

    const getModuleProgress = (moduleId: string) => {
        const module = MODULES.find(m => m.id === moduleId);
        if (!module) return 0;

        const totalActivities = module.activities.length;
        if (totalActivities === 0) return 0;
        
        // FIX: Explicitly cast `p` to `any` to resolve a TypeScript type inference issue.
        const completedActivities = progress[moduleId] ? Object.values(progress[moduleId]).filter((p: any) => p.completed).length : 0;
        return Math.round((completedActivities / totalActivities) * 100);
    };

    return (
        <div className="space-y-8">
            <header className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/50 overflow-hidden shadow-lg">
                    {user?.avatar ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <UserCircleIcon className="w-12 h-12 text-slate-500" />}
                </div>
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold">Hola, {user?.name}</h2>
                    <p className="text-slate-600 dark:text-slate-400">¡Listo/a para expandir tu mente crítica!</p>
                </div>
            </header>

            <Card>
                <h3 className="text-xl font-bold mb-4 text-center text-slate-700 dark:text-slate-300">Propósito Pedagógico</h3>
                <p className="text-center text-slate-600 dark:text-slate-400 mb-6">
                    Esta aplicación busca desarrollar habilidades de debate y argumentación sobre problemáticas contemporáneas de la sociedad chilena, fomentando el pensamiento crítico y la responsabilidad social.
                </p>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                        <div className="col-span-1">
                            <dt className="font-semibold text-slate-800 dark:text-slate-200">Asignatura</dt>
                            <dd className="text-slate-600 dark:text-slate-400">Lengua y Literatura / Formación Ciudadana</dd>
                        </div>
                        <div className="col-span-1">
                            <dt className="font-semibold text-slate-800 dark:text-slate-200">Curso</dt>
                            <dd className="text-slate-600 dark:text-slate-400">3° Medio</dd>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <dt className="font-semibold text-slate-800 dark:text-slate-200">Objetivo de Aprendizaje (OA_01)</dt>
                            <dd className="text-slate-600 dark:text-slate-400">Analizar, debatir y argumentar sobre problemáticas contemporáneas de la sociedad chilena, abordando su relevancia y complexidad desde múltiples perspectivas (legal, social, cultural y ética), e integrando herramientas de análisis literario y digital para construir una postura crítica fundamentada.</dd>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <dt className="font-semibold text-slate-800 dark:text-slate-200">Contenidos</dt>
                            <dd className="text-slate-600 dark:text-slate-400">
                                <ul className="list-disc list-inside">
                                    <li>Delitos Cibernéticos y Acoso Virtual</li>
                                    <li>Libertad de Expresión vs. Discursos de Odio</li>
                                    <li>Derecho a la Vivienda y Desalojo</li>
                                </ul>
                            </dd>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <dt className="font-semibold text-slate-800 dark:text-slate-200">Habilidades del Siglo XXI</dt>
                            <dd className="text-slate-600 dark:text-slate-400">
                                <div className="flex flex-wrap gap-2 mt-1">
                                    <span className="bg-[#A3DFFF]/30 text-[#005B8C] dark:text-[#A3DFFF] text-xs font-medium px-2.5 py-0.5 rounded-full">Pensamiento Crítico</span>
                                    <span className="bg-[#A3DFFF]/30 text-[#005B8C] dark:text-[#A3DFFF] text-xs font-medium px-2.5 py-0.5 rounded-full">Argumentación</span>
                                    <span className="bg-[#A3DFFF]/30 text-[#005B8C] dark:text-[#A3DFFF] text-xs font-medium px-2.5 py-0.5 rounded-full">Ciudadanía Digital</span>
                                    <span className="bg-[#A3DFFF]/30 text-[#005B8C] dark:text-[#A3DFFF] text-xs font-medium px-2.5 py-0.5 rounded-full">Comunicación Efectiva</span>
                                </div>
                            </dd>
                        </div>
                    </dl>
                </div>
            </Card>

            <Card>
                <h3 className="text-lg font-semibold mb-2">Progreso General</h3>
                <ProgressBar progress={calculateOverallProgress()} />
            </Card>

            <section>
                <h3 className="text-2xl font-bold mb-4">Módulos de Aprendizaje</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MODULES.map(module => (
                        <div key={module.id} onClick={() => onSelectModule(module.id)} className="h-full cursor-pointer">
                            <Card isHoverable={true} className="h-full">
                                <div className="flex flex-col h-full">
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="p-3 bg-[#A3DFFF]/20 rounded-lg">
                                                <module.icon className="w-6 h-6 text-[#A3DFFF]" />
                                            </div>
                                            <h4 className="text-lg font-bold">{module.title}</h4>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{module.description}</p>
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