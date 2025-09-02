import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, className = '', ...props }) => {
    return (
        <button
            {...props}
            className={`bg-gradient-to-r from-sky-500 to-fuchsia-500 text-white font-bold py-3 px-6 rounded-full shadow-lg shadow-sky-500/20
                        hover:shadow-xl hover:shadow-fuchsia-500/30 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-400
                        active:scale-95 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;