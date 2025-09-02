import React from 'react';
import { PrismaLogo } from './icons/Icons';
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
        <div className="min-h-screen text-slate-200 flex flex-col relative overflow-hidden">
            {/* START: Animated Gradient Background */}
            <div className="absolute top-0 left-0 w-full h-full bg-slate-900 -z-20"></div>
            <div className="absolute top-0 left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_500px_at_50%_50%,#38bdf820_0%,#d946ef20_50%,#0f172a_100%)] animate-[spin_20s_linear_infinite] -z-10"></div>
            {/* END: Animated Gradient Background */}
            
            <header className="sticky top-0 bg-slate-900/40 backdrop-blur-xl border-b border-white/10 z-10">
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <PrismaLogo className="h-8 w-8" />
                        <h1 className="text-xl font-bold text-white">Proyecto Prisma</h1>
                    </div>
                    <div className="flex items-center gap-2 md:gap-4">
                       <button
                            onClick={handleExport}
                            className="bg-white/10 border border-white/20 text-white font-semibold px-3 py-2 rounded-full hover:bg-white/20 transition-colors text-xs md:text-sm"
                        >
                            Exportar PDF
                        </button>
                        <button
                            onClick={clearData}
                            className="bg-red-500/50 border border-red-400/30 text-white font-semibold px-3 py-2 rounded-full hover:bg-red-500/70 transition-colors text-xs md:text-sm"
                        >
                            Resetear
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-grow container mx-auto p-4 md:p-6">
                {children}
            </main>

            <footer className="w-full text-center p-4 text-xs text-slate-400">
                Creado por Christian Núñez Vega, Asesor Pedagógico, Programa PACE-UDA, 2025.
            </footer>
        </div>
    );
};

export default Layout;