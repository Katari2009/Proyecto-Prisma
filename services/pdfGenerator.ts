// Note: This assumes jspdf is included as a local script or bundled.
// For this environment, we'll declare it to satisfy TypeScript.
declare const jspdf: any;
import type { UserProfile, UserProgress, Module } from '../types';

export const generatePDF = (user: UserProfile, progress: UserProgress, modules: Module[]): void => {
    // This is a placeholder for a real jsPDF instance.
    // In a real project you'd `import { jsPDF } from 'jspdf';`
    const { jsPDF } = (window as any).jspdf;
    if (!jsPDF) {
        alert("La librería para generar PDF no está cargada. Por favor, contacta al administrador.");
        console.error("jsPDF not found on window object.");
        return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const now = new Date();
    const dateStr = now.toLocaleDateString('es-CL');
    const timeStr = now.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Reporte de Progreso: Proyecto Prisma', pageWidth / 2, 20, { align: 'center' });

    // User Info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nombre: ${user.name}`, 20, 40);
    doc.text(`Curso: ${user.course}`, 20, 45);
    doc.text(`Fecha: ${dateStr}`, pageWidth - 20, 40, { align: 'right' });
    doc.text(`Hora: ${timeStr}`, pageWidth - 20, 45, { align: 'right' });

    doc.line(20, 55, pageWidth - 20, 55); // separator

    // Overall Progress
    const totalActivities = modules.reduce((acc, module) => acc + module.activities.length, 0);
    const completedActivitiesCount = Object.values(progress).flatMap(Object.values).filter(p => p.completed).length;
    const overallProgress = totalActivities > 0 ? Math.round((completedActivitiesCount / totalActivities) * 100) : 0;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Progreso General', 20, 65);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`${overallProgress}% completado`, 20, 72);

    doc.line(20, 80, pageWidth - 20, 80);

    // Per-module progress and activities
    let yPosition = 90;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalle por Módulo', 20, yPosition);
    yPosition += 10;
    
    modules.forEach(module => {
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
        }

        const totalModuleActivities = module.activities.length;
        const completedModuleActivities = progress[module.id] ? Object.values(progress[module.id]).filter(p => p.completed).length : 0;
        const moduleProgress = totalModuleActivities > 0 ? Math.round((completedModuleActivities / totalModuleActivities) * 100) : 0;

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`Módulo: ${module.title} (${moduleProgress}%)`, 20, yPosition);
        yPosition += 7;

        module.activities.forEach(activity => {
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');

            const activityProgress = progress[module.id]?.[activity.id];
            const status = activityProgress?.completed ? 'Completado' : 'Pendiente';
            doc.text(`- ${activity.title}: ${status}`, 25, yPosition);
            yPosition += 5;

            if (activityProgress?.completed && activityProgress.answer) {
                const answerX = 35;
                const answerWidth = pageWidth - answerX - 20;
                doc.setFontSize(9);

                switch (activity.type) {
                    case 'open-question': {
                        if (yPosition > 270) { doc.addPage(); yPosition = 20; }
                        doc.setFont('helvetica', 'italic');
                        const answerText = `Respuesta: ${String(activityProgress.answer)}`;
                        const lines = doc.splitTextToSize(answerText, answerWidth);
                        doc.text(lines, answerX, yPosition);
                        yPosition += lines.length * 4 + 2;
                        break;
                    }
                    case 'multiple-choice': {
                        const answers = activityProgress.answer as { [key: number]: string };
                        activity.content.questions.forEach((q, index) => {
                            if (yPosition > 270) { doc.addPage(); yPosition = 20; }
                            const questionText = `P: ${q.question}`;
                            const answerText = `R: ${answers[index] || 'No respondida'}`;

                            doc.setFont('helvetica', 'normal');
                            const qLines = doc.splitTextToSize(questionText, answerWidth);
                            doc.text(qLines, answerX, yPosition);
                            yPosition += qLines.length * 4;
                            
                            if (yPosition > 270) { doc.addPage(); yPosition = 20; }
                            
                            doc.setFont('helvetica', 'italic');
                            const aLines = doc.splitTextToSize(answerText, answerWidth - 5);
                            doc.text(aLines, answerX + 5, yPosition);
                            yPosition += aLines.length * 4 + 2;
                        });
                        break;
                    }
                    case 'drag-drop': {
                        const allCaseAnswers = activityProgress.answer as { [caseIndex: string]: { [itemId: string]: string } };
                        activity.content.cases.forEach((caseItem, index) => {
                            if (yPosition > 260) { doc.addPage(); yPosition = 20; }
                            
                            doc.setFont('helvetica', 'bold');
                            const caseTitle = `Caso ${index + 1}:`;
                            const titleLines = doc.splitTextToSize(caseTitle, answerWidth);
                            doc.text(titleLines, answerX, yPosition);
                            yPosition += titleLines.length * 4;
                            
                            const caseAnswers = allCaseAnswers[index] || {};
                            caseItem.items.forEach(item => {
                                if (yPosition > 270) { doc.addPage(); yPosition = 20; }
                                const targetId = caseAnswers[item.id];
                                const target = activity.content.targets.find(t => t.id === targetId);
                                const answerText = `${item.text} -> ${target ? target.text : 'No respondido'}`;
                                
                                doc.setFont('helvetica', 'italic');
                                const lines = doc.splitTextToSize(answerText, answerWidth - 5);
                                doc.text(lines, answerX + 5, yPosition);
                                yPosition += lines.length * 4 + 1;
                            });
                            yPosition += 3;
                        });
                        break;
                    }
                }
                doc.setFont('helvetica', 'normal');
            }
        });
        yPosition += 5; // Extra space between modules
    });

    // Footer
    const pageCount = doc.internal.pages.length;
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text('Creado por Christian Núñez Vega, Asesor Pedagógico, Programa PACE-UDA, 2025.', pageWidth / 2, 290, { align: 'center' });
    }

    doc.save(`Reporte_Progreso_${user.name.replace(/\s/g, '_')}.pdf`);
};

// Dummy script include for jsPDF - in a real build this would be handled by a bundler
if (!document.getElementById('jspdf-script')) {
    const script = document.createElement('script');
    script.id = 'jspdf-script';
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.onload = () => console.log('jsPDF loaded for PDF generation.');
    document.head.appendChild(script);
}