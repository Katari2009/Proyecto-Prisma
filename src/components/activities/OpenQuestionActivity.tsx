import React, { useState } from 'react';
import type { Module, Activity } from '../../types';
import { useUser } from '../../hooks/useUser';
import { getAIFeedback } from '../../services/geminiService';
import Card from '../common/Card';
import Button from '../common/Button';
import { SparklesIcon } from '../icons/Icons';

interface Props {
    module: Module;
    activity: Activity<'open-question'>;
    onComplete: () => void;
}

const OpenQuestionActivity: React.FC<Props> = ({ module, activity, onComplete }) => {
    const { updateProgress } = useUser();
    const [answer, setAnswer] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);

    const handleSubmit = () => {
        if (answer.trim().length < 10) {
            alert("Por favor, elabora un poco más tu respuesta.");
            return;
        }
        setSubmitted(true);
        updateProgress(module.id, activity.id, {
            completed: true,
            answer: answer
        });
    };

    const handleGetFeedback = async () => {
        setIsLoadingFeedback(true);
        const generatedFeedback = await getAIFeedback(answer);
        setFeedback(generatedFeedback);
        setIsLoadingFeedback(false);
    };

    return (
        <Card className="p-8">
            <h2 className="text-2xl font-bold mb-2 text-white">{activity.title}</h2>
            <p className="text-slate-300 mb-6">{activity.content.prompt}</p>

            <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                readOnly={submitted}
                placeholder="Escribe tu respuesta aquí..."
                className="w-full h-40 p-4 rounded-2xl bg-slate-800/50 border-2 border-white/10 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-colors text-white"
            />

            <div className="mt-6">
                {!submitted ? (
                    <Button onClick={handleSubmit} className="w-full">
                        Enviar Respuesta
                    </Button>
                ) : (
                    <div className="space-y-4">
                        {feedback && (
                            <div className="bg-gradient-to-br from-sky-500/20 to-fuchsia-500/20 p-4 rounded-2xl border border-white/10">
                                <h4 className="font-semibold text-lg mb-2 flex items-center gap-2 text-white"><SparklesIcon className="w-5 h-5 text-sky-400"/> Retroalimentación IA</h4>
                                <p className="text-slate-200 italic">{feedback}</p>
                            </div>
                        )}
                        {!feedback && (
                             <button
                                onClick={handleGetFeedback}
                                disabled={isLoadingFeedback}
                                className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 font-semibold px-4 py-3 rounded-full transition-colors text-white"
                            >
                                {isLoadingFeedback ? (
                                    <>
                                     <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-sky-400"></div>
                                     <span className="ml-2">Analizando...</span>
                                    </>
                                ) : (
                                    <>
                                        <SparklesIcon className="w-5 h-5 text-sky-400" />
                                        <span>Obtener Feedback con IA</span>
                                    </>
                                )}
                            </button>
                        )}
                       
                        <Button onClick={onComplete} className="w-full">
                            Finalizar
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    );
};

export default OpenQuestionActivity;