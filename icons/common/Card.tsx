
import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    isHoverable?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', isHoverable = false }) => {
    const hoverClasses = isHoverable ? 'transition-all duration-300 hover:scale-105 hover:shadow-2xl' : '';
    return (
        <div className={`bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-white/20 dark:border-slate-700 rounded-2xl shadow-lg p-6 ${hoverClasses} ${className}`}>
            {children}
        </div>
    );
};

export default Card;