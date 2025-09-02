import React, { useState } from 'react';
import type { Module, Activity } from '../../types';
import { useUser } from '../../hooks/useUser';
import Card from '../common/Card';
import Button from '../common/Button';

interface Props {
    module: Module;
    activity: Activity<'multiple-choice'>;
    onComplete: () => void;
}

const MultipleChoiceActivity: React.FC<Props> = ({ module, activity, onComplete }) => {
    const { updateProgress } = useUser();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
    const [showResults, setShowResults] = useState(false);

    const questions = activity.content.questions;
    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;

    const handleAnswerSelect = (option: string) => {
        if (showResults) return;
        setSelectedAnswers(prev => ({ ...prev, [currentQuestionIndex]: option }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setShowResults(true);
            const score = questions.reduce((acc, q, index) => {
                return selectedAnswers[index] === q.answer ? acc + 1 : acc;
            }, 0);
            updateProgress(module.id, activity.id, {
                completed: true,
                score: (score / totalQuestions) * 100,
                answer: selectedAnswers,
            });
        }
    };
    
    const calculateScore = () => {
        return questions.reduce((acc, q, index) => {
            return selectedAnswers[index] === q.answer ? acc + 1 : acc;
        }, 0);
    };

    if (showResults) {
        const finalScore = calculateScore();
        return (
            <Card className="p-8">
                <h2 className="text-3xl font-bold mb-4 text-center text-white">Resultados del Cuestionario</h2>
                <p className="text-center text-lg text-slate-300 mb-6">
                    Obtuviste <span className="font-bold text-sky-400 text-xl">{finalScore}</span> de <span className="font-bold text-xl">{totalQuestions}</span> respuestas correctas.
                </p>
                <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2">
                    {questions.map((q, index) => {
                        const userAnswer = selectedAnswers[index];
                        const isCorrect = userAnswer === q.answer;
                        return (
                            <div key={index} className={`p-4 rounded-2xl border-2 ${isCorrect ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10'}`}>
                                <p className="font-semibold mb-2 text-white">{index + 1}. {q.question}</p>
                                <p className="text-sm">Tu respuesta: <span className={`${isCorrect ? 'text-green-300' : 'text-red-300'} font-medium`}>{userAnswer || "No respondida"}</span></p>
                                {!isCorrect && (
                                    <>
                                        <p className="text-sm">Respuesta correcta: <span className="text-green-300 font-medium">{q.answer}</span></p>
                                        <div className="mt-2 pt-2 border-t border-white/10">
                                            <p className="text-xs text-slate-300"><span className="font-semibold">Explicación:</span> {q.explanation}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
                <Button onClick={onComplete} className="w-full mt-8">
                    Finalizar y Volver
                </Button>
            </Card>
        )
    }

    return (
        <Card className="p-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">{activity.title}</h2>
                <span className="font-semibold text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full">{currentQuestionIndex + 1} / {totalQuestions}</span>
            </div>
            
            <div className="my-6">
                <p className="text-lg font-semibold mb-4 text-white">{currentQuestion.question}</p>
                <div className="space-y-3">
                    {currentQuestion.options.map(option => (
                        <button
                            key={option}
                            onClick={() => handleAnswerSelect(option)}
                            className={`w-full text-left p-4 rounded-xl transition-all duration-200 text-white
                            ${
                                selectedAnswers[currentQuestionIndex] === option
                                ? 'bg-gradient-to-r from-sky-500 to-fuchsia-500 ring-2 ring-white scale-105'
                                : 'bg-slate-800/50 hover:bg-slate-700/70'
                            }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            <Button onClick={handleNext} disabled={selectedAnswers[currentQuestionIndex] === undefined} className="w-full">
                {currentQuestionIndex < questions.length - 1 ? 'Siguiente Pregunta' : 'Ver Resultados'}
            </Button>
        </Card>
    );
};

export default MultipleChoiceActivity;