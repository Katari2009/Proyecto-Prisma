import React, { useEffect, useState } from 'react';
import { useUser } from '../hooks/useUser';
import type { GamificationEvent } from '../hooks/useUser';

const Toast: React.FC<{ event: GamificationEvent, onDismiss: () => void }> = ({ event, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 5000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    const { type, payload } = event;
    const isLevelUp = type === 'level-up';
    const Icon = payload.icon;
    const title = isLevelUp ? '¡Subiste de Nivel!' : '¡Logro Desbloqueado!';
    const message = isLevelUp ? `Ahora eres ${payload.name}` : `Ganaste la insignia: ${payload.name}`;
    const color = isLevelUp ? (payload as any).color : 'text-amber-400';

    return (
        <div className="animate-fade-in w-full max-w-sm bg-slate-800/80 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-4 flex items-center gap-4">
            <div className="flex-shrink-0">
                <Icon className={`w-10 h-10 ${color}`} />
            </div>
            <div className="flex-grow">
                <p className={`font-bold text-white`}>{title}</p>
                <p className="text-sm text-slate-300">{message}</p>
            </div>
            <button onClick={onDismiss} className="text-slate-400 hover:text-white">&times;</button>
        </div>
    );
};


const Confetti: React.FC = () => {
    const colors = ['#38bdf8', '#d946ef', '#f59e0b', '#10b981'];
    const particles = Array.from({ length: 100 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${-20 - Math.random() * 100}%`,
        animationDuration: `${2 + Math.random() * 3}s`,
        animationDelay: `${Math.random() * 2}s`,
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        transform: `rotate(${Math.random() * 360}deg)`,
    }));

    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-50">
            {particles.map(p => (
                <div key={p.id}
                     className="absolute w-2 h-4 rounded-sm animate-fall"
                     style={{ ...p }}
                />
            ))}
            <style>{`
                @keyframes fall {
                    0% { transform: translateY(0) rotate(0); opacity: 1; }
                    100% { transform: translateY(120vh) rotate(720deg); opacity: 0; }
                }
                .animate-fall { animation: fall linear forwards; }
            `}</style>
        </div>
    );
};


const GamificationFeedback: React.FC = () => {
    const { gamificationEvents, dismissGamificationEvent } = useUser();
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        const hasLevelUp = gamificationEvents.some(e => e.type === 'level-up');
        if (hasLevelUp) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 5000); // Confetti lasts 5 seconds
            return () => clearTimeout(timer);
        }
    }, [gamificationEvents]);

    if(gamificationEvents.length === 0) return null;

    return (
        <>
            {showConfetti && <Confetti />}
            <div className="fixed bottom-5 right-5 z-50 space-y-3 w-full max-w-sm">
                {gamificationEvents.map(event => (
                    <Toast
                        key={event.id}
                        event={event}
                        onDismiss={() => dismissGamificationEvent(event.id)}
                    />
                ))}
            </div>
        </>
    );
};

export default GamificationFeedback;