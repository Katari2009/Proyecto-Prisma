
import React from 'react';
import { ConectaChileLogo } from './icons/Icons';
import { useUser } from '../hooks/useUser';
import { generatePDF } from '../services/pdfGenerator';
import { MODULES } from '../constants';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, progress, clearData } = useUser();

    const handleExport = () => {
        if (user) {
            generatePDF(user, progress, MODULES);
        }
    };
    
    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col">
            <header className="sticky top-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-lg shadow-md z-10">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <ConectaChileLogo className="h-8 w-8 text-[#A3DFFF]" />
                        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Conecta Chile</h1>
                    </div>
                    <div className="flex items-center gap-4">
                       <button
                            onClick={handleExport}
                            className="bg-[#A8F1D6] text-slate-800 font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm"
                        >
                            Exportar PDF
                        </button>
                        <button
                            onClick={clearData}
                            className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity text-sm"
                        >
                            Resetear
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-grow container mx-auto p-4 md:p-6">
                {children}
            </main>

            <footer className="w-full text-center p-4 text-xs text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-800">
                Creado por Christian Núñez Vega, Asesor Pedagógico, Programa PACE-UDA, 2025.
            </footer>
        </div>
    );
};

export default Layout;