
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, className = '', ...props }) => {
    return (
        <button
            {...props}
            className={`bg-gradient-to-r from-[#A3DFFF] to-[#A8F1D6] text-slate-800 font-bold py-3 px-6 rounded-xl shadow-md
                        hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A3DFFF]
                        active:scale-95 transition-transform duration-150 ease-in-out ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;