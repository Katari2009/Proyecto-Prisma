
import React from 'react';

interface ProgressBarProps {
    progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
    const clampedProgress = Math.max(0, Math.min(100, progress));

    return (
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 relative overflow-hidden">
            <div
                className="bg-gradient-to-r from-[#A3DFFF] to-[#A8F1D6] h-4 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${clampedProgress}%` }}
            ></div>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-slate-800">
                {clampedProgress}%
            </span>
        </div>
    );
};

export default ProgressBar;