import React, { useState } from 'react';
// FIX: Import NavLink from react-router-dom to resolve 'Cannot find name' error.
import { useNavigate, NavLink } from 'react-router-dom';
import { Card, PrimaryButton, SecondaryButton } from '../components/ui';
import { Building, Upload, UsersRound, BookCopy, CheckCircle, ArrowRight, ArrowLeft, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
    { name: 'Escuela', icon: Building },
    { name: 'Importar', icon: Upload },
    { name: 'Grupos', icon: UsersRound },
    { name: 'Finalizar', icon: CheckCircle },
];

const StepIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => (
    <div className="flex justify-between items-center mb-8">
        {steps.map((step, index) => (
            <React.Fragment key={step.name}>
                <div className="flex flex-col items-center text-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-bold ${
                        index < currentStep ? 'bg-cyan border-cyan text-bg' : 
                        index === currentStep ? 'border-cyan text-cyan scale-110 shadow-glowCyan' : 
                        'bg-surface border-border text-text-secondary'
                    }`}>
                        {index < currentStep ? <CheckCircle size={20} /> : <step.icon size={20} />}
                    </div>
                    <span className={`mt-2 text-xs font-medium transition-colors ${index <= currentStep ? 'text-text-primary' : 'text-muted'}`}>{step.name}</span>
                </div>
                {index < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 transition-colors ${index < currentStep ? 'bg-cyan' : 'bg-border'}`} />}
            </React.Fragment>
        ))}
    </div>
);


export const OnboardingB2BPage: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [schoolName, setSchoolName] = useState('');

    const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    const handlePrev = () => setCurrentStep(prev => Math.max(0, prev - 1));
    const handleFinish = () => navigate('/director/dashboard');

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // School
                return (
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">Crear tu Escuela</h3>
                        <p className="text-text-secondary mb-6">Empecemos por darle un nombre a tu institución en la plataforma.</p>
                        <label htmlFor="schoolName" className="block text-sm font-medium text-text-secondary">Nombre de la Escuela</label>
                        <input type="text" id="schoolName" value={schoolName} onChange={e => setSchoolName(e.target.value)} placeholder="Ej: Colegio Vanguardia" className="mt-1 block w-full bg-surface border-border rounded-input shadow-sm focus:ring-purple focus:border-purple"/>
                    </div>
                );
            case 1: // Import
                return (
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">Importar Usuarios</h3>
                        <p className="text-text-secondary mb-6">Sube tus archivos CSV con la lista de docentes y alumnos. Puedes descargar las plantillas para asegurar el formato correcto.</p>
                        <div className="space-y-4">
                            <Card className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div>
                                    <h4 className="font-semibold text-white">Docentes</h4>
                                    <p className="text-xs text-text-secondary">Importa la lista de tus profesores.</p>
                                </div>
                                <SecondaryButton>Subir CSV</SecondaryButton>
                            </Card>
                             <Card className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div>
                                    <h4 className="font-semibold text-white">Alumnos</h4>
                                    <p className="text-xs text-text-secondary">Importa la lista de estudiantes.</p>
                                </div>
                                <SecondaryButton>Subir CSV</SecondaryButton>
                            </Card>
                        </div>
                    </div>
                );
            case 2: // Groups
                 return (
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">Configurar Grupos y Materias</h3>
                        <p className="text-text-secondary mb-6">Crea los grupos (ej: 3er Grado - A) y asigna las materias que llevarán.</p>
                        {/* Simplified UI for demo */}
                        <Card className="p-4">
                            <input type="text" placeholder="Nombre del nuevo grupo..." className="block w-full bg-surface border-border rounded-input shadow-sm mb-2"/>
                            <select multiple className="block w-full bg-surface border-border rounded-input shadow-sm mb-2 h-24">
                                <option>Matemáticas</option>
                                <option>Lengua</option>
                                <option>Historia</option>
                                <option>Física</option>
                            </select>
                            <PrimaryButton className="text-sm w-full">Añadir Grupo</PrimaryButton>
                        </Card>
                    </div>
                );
            case 3: // Finish
                return (
                    <div className="text-center">
                        <CheckCircle size={48} className="mx-auto text-green-400 mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">¡Configuración Completa!</h3>
                        <p className="text-text-secondary mb-6">Tu escuela "{schoolName}" está lista. Ahora puedes acceder al panel de dirección para monitorear el progreso.</p>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-transparent">
            <div className="w-full max-w-2xl z-10">
                <div className="flex justify-center mb-6">
                    <NavLink to="/" className="flex items-center space-x-2">
                    <BrainCircuit className="h-10 w-10 text-cyan" />
                    <span className="text-3xl font-bold text-white">TutoriA Academy Setup</span>
                    </NavLink>
                </div>
                <Card>
                    <StepIndicator currentStep={currentStep} />
                    <div className="min-h-[250px] py-4">
                         <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                            >
                                {renderStepContent()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    <div className="flex justify-between mt-8 border-t border-border pt-6">
                        <SecondaryButton onClick={handlePrev} disabled={currentStep === 0}>
                            <ArrowLeft className="mr-2" size={16}/> Anterior
                        </SecondaryButton>
                        {currentStep < steps.length - 1 ? (
                             <PrimaryButton onClick={handleNext}>
                                Siguiente <ArrowRight className="ml-2" size={16}/>
                            </PrimaryButton>
                        ) : (
                            <PrimaryButton onClick={handleFinish}>
                                Ir al Dashboard <CheckCircle className="ml-2" size={16}/>
                            </PrimaryButton>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};