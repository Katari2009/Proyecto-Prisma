import React from 'react';

interface ProgressBarProps {
    progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
    const clampedProgress = Math.max(0, Math.min(100, progress));

    return (
        <div className="w-full bg-slate-900/30 rounded-full h-5 relative overflow-hidden border border-white/10">
            <div
                className="bg-gradient-to-r from-sky-400 to-fuchsia-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${clampedProgress}%` }}
            ></div>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white tracking-wider">
                {clampedProgress}%
            </span>
        </div>
    );
};

export default ProgressBar;