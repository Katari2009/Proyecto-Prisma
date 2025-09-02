import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    isHoverable?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', isHoverable = false }) => {
    const hoverClasses = isHoverable ? 'transition-all duration-300 hover:scale-102 hover:shadow-cyan-500/10 hover:border-white/30' : '';
    return (
        <div className={`bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-black/20 p-6 ${hoverClasses} ${className}`}>
            {children}
        </div>
    );
};

export default Card;