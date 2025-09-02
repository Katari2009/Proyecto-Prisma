
import React, { useState, useMemo } from 'react';
import type { Module, Activity } from '../../types';
import { useUser } from '../../hooks/useUser';
import Card from '../common/Card';
import Button from '../common/Button';

interface Props {
    module: Module;
    activity: Activity<'drag-drop'>;
    onComplete: () => void;
}

// Helper function to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const MatchingActivity: React.FC<Props> = ({ module, activity, onComplete }) => {
    const { updateProgress } = useUser();
    const { cases, targets } = activity.content;
    
    const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
    const [allAnswers, setAllAnswers] = useState<{ [caseIndex: number]: { [itemId: string]: string } }>({});
    const [submitted, setSubmitted] = useState(false);

    const currentCase = cases[currentCaseIndex];
    const currentAnswers = allAnswers[currentCaseIndex] || {};

    // FIX: Corrected the syntax for the useMemo hook. The 'of' keyword was a typo.
    const shuffledTargets = useMemo(() => shuffleArray(targets), [targets]);

    const handleSelect = (itemId: string, targetId: string) => {
        if (submitted) return;
        setAllAnswers(prev => ({
            ...prev,
            [currentCaseIndex]: {
                ...prev[currentCaseIndex],
                [itemId]: targetId
            }
        }));
    };
    
    const handleNext = () => {
        if (currentCaseIndex < cases.length - 1) {
            setCurrentCaseIndex(prev => prev + 1);
        }
    };
    
    const handlePrev = () => {
         if (currentCaseIndex > 0) {
            setCurrentCaseIndex(prev => prev - 1);
        }
    };

    const handleSubmit = () => {
        setSubmitted(true);
        let totalCorrect = 0;
        cases.forEach((caseItem, index) => {
            const userAnswersForCase = allAnswers[index] || {};
            const correctCaseAnswers = Object.keys(userAnswersForCase).filter(
                itemId => userAnswersForCase[itemId] === caseItem.correctMapping[itemId]
            ).length;
            totalCorrect += correctCaseAnswers;
        });
        
        const totalItems = cases.reduce((acc, c) => acc + c.items.length, 0);
        const score = (totalCorrect / totalItems) * 100;
        
        updateProgress(module.id, activity.id, {
            completed: true,
            score: score,
            answer: allAnswers
        });
    };
    
    const getBorderColor = (itemId: string) => {
        if (!submitted) return 'border-slate-300 dark:border-slate-600';
        const isCorrect = currentAnswers[itemId] === currentCase.correctMapping[itemId];
        return isCorrect ? 'border-green-500' : 'border-red-500';
    };

    const isCurrentCaseComplete = currentCase.items.every(item => currentAnswers[item.id]);
    
    return (
        <Card className="p-8">
            <h2 className="text-2xl font-bold mb-2">{activity.title}</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">{activity.description}</p>
            
            <div className="text-center font-semibold text-slate-500 mb-4">Caso {currentCaseIndex + 1} de {cases.length}</div>
            
            <Card className="bg-slate-100/50 dark:bg-slate-900/50 mb-6 p-4">
                <p className="italic text-slate-700 dark:text-slate-300">{currentCase.description}</p>
            </Card>

            <div className="space-y-4 mb-8">
                {currentCase.items.map(item => (
                    <div key={item.id} className="grid grid-cols-2 gap-4 items-center">
                        <div className="font-semibold p-3 bg-slate-100 dark:bg-slate-700 rounded-lg">
                            {item.text}
                        </div>
                        <select
                            value={currentAnswers[item.id] || ''}
                            onChange={(e) => handleSelect(item.id, e.target.value)}
                            disabled={submitted}
                            className={`w-full p-3 rounded-lg bg-white dark:bg-slate-800 border-2 transition-colors ${getBorderColor(item.id)}`}
                        >
                            <option value="" disabled>Selecciona un rol...</option>
                            {shuffledTargets.map(target => (
                                <option key={target.id} value={target.id}>{target.text}</option>
                            ))}
                        </select>
                    </div>
                ))}
            </div>

            {submitted ? (
                <div className="space-y-4">
                     <p className="text-center font-bold">Revisión Finalizada</p>
                     <div className="flex justify-between mt-4">
                        <Button onClick={handlePrev} disabled={currentCaseIndex === 0}>Anterior</Button>
                        <Button onClick={handleNext} disabled={currentCaseIndex === cases.length - 1}>Siguiente</Button>
                    </div>
                    <Button onClick={onComplete} className="w-full bg-gradient-to-r from-green-400 to-blue-500">
                        Finalizar Actividad
                    </Button>
                </div>
            ) : (
                <div className="flex justify-between items-center">
                    <Button onClick={handlePrev} disabled={currentCaseIndex === 0}>Anterior</Button>
                    
                    {currentCaseIndex === cases.length - 1 ? (
                        <Button onClick={handleSubmit} disabled={!isCurrentCaseComplete}>Verificar Respuestas</Button>
                    ): (
                        <Button onClick={handleNext} disabled={!isCurrentCaseComplete}>Siguiente</Button>
                    )}
                </div>
            )}
        </Card>
    );
};

export default MatchingActivity;