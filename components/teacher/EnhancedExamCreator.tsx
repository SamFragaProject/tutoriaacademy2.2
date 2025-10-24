import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Plus, Trash2, Edit2, Save, Send, Download, Upload, ChevronRight,
  FileText, Settings, Eye, RefreshCw, CheckCircle, AlertCircle, Clock, Users,
  BookOpen, Target, Brain, List, Search, ChevronDown, ChevronUp, X, Check, FolderTree, Copy
} from 'lucide-react';
import { Card } from '../ui';
import { useAuth } from '../../hooks/useAuth';
import { getGroupsByTeacher, getStudentsByGroup } from '../../data/schoolMockData';

// ============================
// TIPOS E INTERFACES
// ============================

type QuestionType = 
  | 'opcion_multiple' 
  | 'verdadero_falso' 
  | 'respuesta_corta' 
  | 'completar_espacios'
  | 'relacionar_columnas'
  | 'ordenar_secuencia'
  | 'respuesta_larga'
  | 'opcion_multiple_multiple';

type Dificultad = 'facil' | 'media' | 'dificil';

interface Tema {
  id: string;
  nombre: string;
  materia: string;
  nivel: 'unidad' | 'tema' | 'subtema';
  parentId?: string;
  descripcion?: string;
  keywords: string[];
  children?: Tema[];
  preguntasDisponibles?: number;
}

interface Pregunta {
  id: string;
  tipo: QuestionType;
  pregunta: string;
  opciones?: { id: string; texto: string; esCorrecta: boolean }[];
  respuestaCorrecta?: string | string[];
  puntos: number;
  dificultad: Dificultad;
  tema: string;
  materia: string;
  retroalimentacion?: string;
  tiempoEstimado?: number; // segundos
}

interface ExamenConfig {
  id?: string;
  nombre: string;
  materia: string;
  fecha: Date;
  duracion: number;
  gruposAsignados: string[];
  temasSeleccionados: {
    temaId: string;
    peso: number; // porcentaje
  }[];
  distribucionPreguntas: {
    tipo: QuestionType;
    cantidad: number;
  }[];
  distribucionDificultad: {
    facil: number;
    media: number;
    dificil: number;
  };
  totalPuntos: number;
  barajarPreguntas: boolean;
  barajarOpciones: boolean;
  mostrarResultados: boolean;
  instrucciones?: string;
}

// ============================
// DATOS MOCK
// ============================

const MATERIAS = [
  'Matemáticas',
  'Física', 
  'Química',
  'Biología',
  'Historia',
  'Geografía',
  'Literatura',
  'Inglés'
];

const TEMAS_MOCK: Tema[] = [
  {
    id: 'mat-u1',
    nombre: 'Unidad 1: Álgebra',
    materia: 'Matemáticas',
    nivel: 'unidad',
    descripcion: 'Fundamentos de álgebra',
    keywords: ['álgebra', 'ecuaciones', 'variables'],
    preguntasDisponibles: 45,
    children: [
      {
        id: 'mat-u1-t1',
        nombre: 'Ecuaciones Lineales',
        materia: 'Matemáticas',
        nivel: 'tema',
        parentId: 'mat-u1',
        keywords: ['ecuaciones', 'lineales', 'primer grado'],
        preguntasDisponibles: 15
      },
      {
        id: 'mat-u1-t2',
        nombre: 'Ecuaciones Cuadráticas',
        materia: 'Matemáticas',
        nivel: 'tema',
        parentId: 'mat-u1',
        keywords: ['ecuaciones', 'cuadráticas', 'segundo grado'],
        preguntasDisponibles: 12
      },
      {
        id: 'mat-u1-t3',
        nombre: 'Sistemas de Ecuaciones',
        materia: 'Matemáticas',
        nivel: 'tema',
        parentId: 'mat-u1',
        keywords: ['sistemas', 'ecuaciones', 'múltiples variables'],
        preguntasDisponibles: 18
      }
    ]
  },
  {
    id: 'mat-u2',
    nombre: 'Unidad 2: Geometría',
    materia: 'Matemáticas',
    nivel: 'unidad',
    descripcion: 'Geometría plana y espacial',
    keywords: ['geometría', 'figuras', 'áreas', 'volúmenes'],
    preguntasDisponibles: 38,
    children: [
      {
        id: 'mat-u2-t1',
        nombre: 'Triángulos',
        materia: 'Matemáticas',
        nivel: 'tema',
        parentId: 'mat-u2',
        keywords: ['triángulos', 'ángulos', 'lados'],
        preguntasDisponibles: 15
      },
      {
        id: 'mat-u2-t2',
        nombre: 'Círculos',
        materia: 'Matemáticas',
        nivel: 'tema',
        parentId: 'mat-u2',
        keywords: ['círculos', 'radio', 'diámetro', 'perímetro'],
        preguntasDisponibles: 12
      },
      {
        id: 'mat-u2-t3',
        nombre: 'Polígonos',
        materia: 'Matemáticas',
        nivel: 'tema',
        parentId: 'mat-u2',
        keywords: ['polígonos', 'lados', 'ángulos'],
        preguntasDisponibles: 11
      }
    ]
  }
];

const TIPOS_PREGUNTA = [
  { 
    id: 'opcion_multiple', 
    nombre: 'Opción Múltiple',
    icono: '🔘',
    descripcion: 'Seleccionar una respuesta correcta',
    tiempoPromedio: 60 // segundos
  },
  { 
    id: 'verdadero_falso', 
    nombre: 'Verdadero/Falso',
    icono: '✓✗',
    descripcion: 'Afirmaciones para evaluar',
    tiempoPromedio: 30
  },
  { 
    id: 'respuesta_corta', 
    nombre: 'Respuesta Corta',
    icono: '✏️',
    descripcion: 'Respuestas breves de 1-3 palabras',
    tiempoPromedio: 90
  },
  { 
    id: 'completar_espacios', 
    nombre: 'Completar Espacios',
    icono: '📝',
    descripcion: 'Llenar espacios en blanco',
    tiempoPromedio: 75
  },
  { 
    id: 'relacionar_columnas', 
    nombre: 'Relacionar Columnas',
    icono: '↔️',
    descripcion: 'Emparejar elementos de dos listas',
    tiempoPromedio: 120
  },
  { 
    id: 'ordenar_secuencia', 
    nombre: 'Ordenar Secuencia',
    icono: '🔢',
    descripcion: 'Colocar elementos en orden correcto',
    tiempoPromedio: 90
  },
  { 
    id: 'respuesta_larga', 
    nombre: 'Respuesta Larga',
    icono: '📄',
    descripcion: 'Desarrollo de ensayo o explicación',
    tiempoPromedio: 300
  },
  { 
    id: 'opcion_multiple_multiple', 
    nombre: 'Opción Múltiple (Varias)',
    icono: '☑️',
    descripcion: 'Seleccionar todas las respuestas correctas',
    tiempoPromedio: 90
  }
];

// ============================
// COMPONENTE PRINCIPAL
// ============================

export const EnhancedExamCreator: React.FC = () => {
  const { user } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  
  // Step 1: Configuración básica
  const [config, setConfig] = useState<Partial<ExamenConfig>>({
    nombre: '',
    materia: 'Matemáticas',
    fecha: new Date(),
    duracion: 60,
    gruposAsignados: [],
    barajarPreguntas: true,
    barajarOpciones: true,
    mostrarResultados: false
  });
  
  // Step 2: Selección de temas
  const [temasSeleccionados, setTemasSeleccionados] = useState<string[]>([]);
  const [pesosTemas, setPesosTemas] = useState<Record<string, number>>({});
  const [searchTemas, setSearchTemas] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  
  // Step 3: Configuración de preguntas
  const [tiposSeleccionados, setTiposSeleccionados] = useState<Record<QuestionType, number>>({
    opcion_multiple: 8,
    verdadero_falso: 5,
    respuesta_corta: 0,
    completar_espacios: 0,
    relacionar_columnas: 0,
    ordenar_secuencia: 0,
    respuesta_larga: 0,
    opcion_multiple_multiple: 0
  });
  
  const [distribucionDificultad, setDistribucionDificultad] = useState({
    facil: 40,
    media: 40,
    dificil: 20
  });
  
  // Step 4: Preguntas generadas
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [generando, setGenerando] = useState(false);
  
  // Step 5: Preview
  const [mostrarRespuestas, setMostrarRespuestas] = useState(false);

  // ============================
  // COMPUTED VALUES
  // ============================

  const myGroups = useMemo(() => {
    if (!user?.id) return [];
    return getGroupsByTeacher(user.id);
  }, [user?.id]);

  const totalPreguntas = useMemo(() => {
    return Object.values(tiposSeleccionados).reduce((sum: number, count) => sum + (count as number), 0);
  }, [tiposSeleccionados]);

  const duracionEstimada = useMemo(() => {
    let total = 0;
    Object.entries(tiposSeleccionados).forEach(([tipo, cantidad]) => {
      const tipoInfo = TIPOS_PREGUNTA.find(t => t.id === tipo);
      if (tipoInfo && typeof cantidad === 'number') {
        total += tipoInfo.tiempoPromedio * cantidad;
      }
    });
    return Math.ceil(total / 60); // convertir a minutos
  }, [tiposSeleccionados]);

  const temasConPeso = useMemo(() => {
    return temasSeleccionados.map(temaId => {
      const findTema = (temas: Tema[]): Tema | undefined => {
        for (const tema of temas) {
          if (tema.id === temaId) return tema;
          if (tema.children) {
            const found = findTema(tema.children);
            if (found) return found;
          }
        }
      };
      const tema = findTema(TEMAS_MOCK);
      return {
        temaId,
        tema,
        peso: pesosTemas[temaId] || 0
      };
    }).filter(t => t.tema);
  }, [temasSeleccionados, pesosTemas]);

  const pesoTotal = useMemo(() => {
    return Object.values(pesosTemas).reduce((sum: number, peso) => sum + (peso as number), 0);
  }, [pesosTemas]);

  // ============================
  // HANDLERS
  // ============================

  const handleToggleTema = (temaId: string) => {
    setTemasSeleccionados(prev => {
      if (prev.includes(temaId)) {
        // Remover tema
        const newPesos = { ...pesosTemas };
        delete newPesos[temaId];
        setPesosTemas(newPesos);
        return prev.filter(id => id !== temaId);
      } else {
        // Agregar tema con peso automático
        const newSeleccionados = [...prev, temaId];
        const pesoAutomatico = Math.floor(100 / newSeleccionados.length);
        const newPesos = { ...pesosTemas };
        newSeleccionados.forEach(id => {
          newPesos[id] = pesoAutomatico;
        });
        setPesosTemas(newPesos);
        return newSeleccionados;
      }
    });
  };

  const handleChangePeso = (temaId: string, peso: number) => {
    setPesosTemas(prev => ({ ...prev, [temaId]: peso }));
  };

  const handleToggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const handleChangeTipoCantidad = (tipo: QuestionType, cantidad: number) => {
    setTiposSeleccionados(prev => ({ ...prev, [tipo]: Math.max(0, cantidad) }));
  };

  const handleGenerarPreguntas = async () => {
    setGenerando(true);
    
    // Simular generación con IA
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generar preguntas mock
    const preguntasGeneradas: Pregunta[] = [];
    let idCounter = 1;
    
    Object.entries(tiposSeleccionados).forEach(([tipo, cantidad]) => {
      const cantidadNum = cantidad as number;
      for (let i = 0; i < cantidadNum; i++) {
        preguntasGeneradas.push(generarPreguntaMock(tipo as QuestionType, idCounter++));
      }
    });
    
    setPreguntas(preguntasGeneradas);
    setGenerando(false);
    setStep(4);
  };

  const generarPreguntaMock = (tipo: QuestionType, id: number): Pregunta => {
    const temaAleatorio = temasSeleccionados[Math.floor(Math.random() * temasSeleccionados.length)];
    const dificultades: Dificultad[] = ['facil', 'media', 'dificil'];
    const dificultad = dificultades[Math.floor(Math.random() * dificultades.length)];
    
    const baseQuestion: Pregunta = {
      id: `q${id}`,
      tipo,
      pregunta: `Pregunta ${id} de tipo ${tipo}`,
      puntos: tipo === 'respuesta_larga' ? 10 : tipo === 'relacionar_columnas' ? 5 : 2,
      dificultad,
      tema: temaAleatorio,
      materia: config.materia!,
      retroalimentacion: 'Retroalimentación de ejemplo'
    };
    
    if (tipo === 'opcion_multiple' || tipo === 'opcion_multiple_multiple') {
      baseQuestion.opciones = [
        { id: 'a', texto: 'Opción A', esCorrecta: true },
        { id: 'b', texto: 'Opción B', esCorrecta: false },
        { id: 'c', texto: 'Opción C', esCorrecta: false },
        { id: 'd', texto: 'Opción D', esCorrecta: false }
      ];
    }
    
    return baseQuestion;
  };

  const handleGuardarExamen = () => {
    const examen: ExamenConfig = {
      id: `exam_${Date.now()}`,
      nombre: config.nombre!,
      materia: config.materia!,
      fecha: config.fecha!,
      duracion: config.duracion!,
      gruposAsignados: config.gruposAsignados!,
      temasSeleccionados: temasConPeso.map(t => ({
        temaId: t.temaId,
        peso: t.peso
      })),
      distribucionPreguntas: Object.entries(tiposSeleccionados)
        .filter(([_, cantidad]) => (cantidad as number) > 0)
        .map(([tipo, cantidad]) => ({
          tipo: tipo as QuestionType,
          cantidad: cantidad as number
        })),
      distribucionDificultad,
      totalPuntos: preguntas.reduce((sum, p) => sum + p.puntos, 0),
      barajarPreguntas: config.barajarPreguntas!,
      barajarOpciones: config.barajarOpciones!,
      mostrarResultados: config.mostrarResultados!,
      instrucciones: config.instrucciones
    };
    
    // Guardar en localStorage
    try {
      const stored = localStorage.getItem(`exams_${user?.id}`) || '[]';
      const exams = JSON.parse(stored);
      exams.push({ ...examen, preguntas });
      localStorage.setItem(`exams_${user?.id}`, JSON.stringify(exams));
      
      alert(`✅ Examen guardado exitosamente!\n\n📝 "${examen.nombre}"\n❓ ${preguntas.length} preguntas\n⭐ ${examen.totalPuntos} puntos totales\n👥 ${examen.gruposAsignados.length} grupos`);
    } catch (error) {
      console.error('Error saving exam:', error);
      alert('❌ Error al guardar el examen');
    }
  };

  // ============================
  // RENDER FUNCTIONS
  // ============================

  const renderTreeNode = (tema: Tema, level: number = 0): React.ReactNode => {
    const isExpanded = expandedNodes.has(tema.id);
    const isSelected = temasSeleccionados.includes(tema.id);
    const hasChildren = tema.children && tema.children.length > 0;
    
    const icon = tema.nivel === 'unidad' ? '📖' : '📄';
    
    return (
      <div key={tema.id}>
        <div
          className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
            isSelected ? 'bg-blue-500/20 border-l-4 border-blue-500' : 'hover:bg-white/5'
          }`}
          style={{ paddingLeft: `${level * 20 + 12}px` }}
        >
          {hasChildren && (
            <button
              onClick={() => handleToggleNode(tema.id)}
              className="p-1 hover:bg-white/10 rounded"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
          
          <span className="text-2xl">{icon}</span>
          
          <div className="flex-1" onClick={() => handleToggleTema(tema.id)}>
            <p className="text-white font-medium">{tema.nombre}</p>
            {tema.preguntasDisponibles && (
              <p className="text-white/60 text-xs">
                {tema.preguntasDisponibles} preguntas disponibles
              </p>
            )}
          </div>
          
          {isSelected && (
            <CheckCircle className="w-5 h-5 text-blue-400" />
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {tema.children!.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">📋 Configuración Básica</h2>
      
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-white/60 mb-2">Nombre del Examen *</label>
          <input
            type="text"
            value={config.nombre || ''}
            onChange={(e) => setConfig(prev => ({ ...prev, nombre: e.target.value }))}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            placeholder="Ej: Examen Final - Álgebra"
          />
        </div>
        
        <div>
          <label className="block text-sm text-white/60 mb-2">Materia *</label>
          <select
            value={config.materia || ''}
            onChange={(e) => setConfig(prev => ({ ...prev, materia: e.target.value }))}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
          >
            {MATERIAS.map(m => (
              <option key={m} value={m} className="bg-gray-800">{m}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm text-white/60 mb-2">Fecha del Examen *</label>
          <input
            type="date"
            value={config.fecha?.toISOString().split('T')[0] || ''}
            onChange={(e) => setConfig(prev => ({ ...prev, fecha: new Date(e.target.value) }))}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
          />
        </div>
        
        <div>
          <label className="block text-sm text-white/60 mb-2">Duración (minutos) *</label>
          <input
            type="number"
            value={config.duracion || 60}
            onChange={(e) => setConfig(prev => ({ ...prev, duracion: parseInt(e.target.value) }))}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            min="1"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm text-white/60 mb-3">Grupos Asignados *</label>
        <div className="grid grid-cols-2 gap-3">
          {(myGroups && myGroups.length > 0) ? myGroups.map(group => (
            <label
              key={group.id}
              className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
            >
              <input
                type="checkbox"
                checked={config.gruposAsignados?.includes(group.id) || false}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setConfig(prev => ({
                    ...prev,
                    gruposAsignados: checked
                      ? [...(prev.gruposAsignados || []), group.id]
                      : (prev.gruposAsignados || []).filter(id => id !== group.id)
                  }));
                }}
                className="w-5 h-5"
              />
              <div className="flex-1">
                <p className="text-white font-medium">{group.nombre}</p>
                <p className="text-white/60 text-sm">{group.estudiantes?.length || 0} estudiantes</p>
              </div>
            </label>
          )) : (
            <div className="col-span-2 p-6 text-center text-white/60">
              <p>No tienes grupos asignados</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end gap-3">
        <button
          onClick={() => setStep(2)}
          disabled={!config.nombre || !config.materia || !config.gruposAsignados?.length}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">📚 Selección de Temas</h2>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Columna Izquierda: Árbol de Temas */}
        <div>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={searchTemas}
                onChange={(e) => setSearchTemas(e.target.value)}
                placeholder="Buscar temas..."
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-lg p-4 max-h-[500px] overflow-y-auto">
            {TEMAS_MOCK.filter(t => t.materia === config.materia).map(tema => renderTreeNode(tema))}
          </div>
          
          <div className="mt-4 space-y-2">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/20 hover:bg-white/10 text-white rounded-lg transition-colors">
              <Upload className="w-5 h-5" />
              Subir Documento (PDF/Word)
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/20 hover:bg-white/10 text-white rounded-lg transition-colors">
              <Plus className="w-5 h-5" />
              Crear Tema Manual
            </button>
          </div>
        </div>
        
        {/* Columna Derecha: Temas Seleccionados */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            Temas Seleccionados ({temasSeleccionados.length})
          </h3>
          
          {temasSeleccionados.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-lg p-8 text-center">
              <FolderTree className="w-12 h-12 text-white/40 mx-auto mb-3" />
              <p className="text-white/60">Selecciona temas del árbol</p>
            </div>
          ) : (
            <div className="space-y-3">
              {temasConPeso.map(({ temaId, tema, peso }) => tema && (
                <div key={temaId} className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <p className="text-white font-medium">{tema.nombre}</p>
                      <p className="text-white/60 text-sm">{tema.preguntasDisponibles} preguntas</p>
                    </div>
                    <button
                      onClick={() => handleToggleTema(temaId)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-white/60" />
                    </button>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm text-white/60">Peso: {peso}%</label>
                      <input
                        type="number"
                        value={peso}
                        onChange={(e) => handleChangePeso(temaId, parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 bg-white/5 border border-white/10 rounded text-white text-sm text-center"
                        min="0"
                        max="100"
                      />
                    </div>
                    <input
                      type="range"
                      value={peso}
                      onChange={(e) => handleChangePeso(temaId, parseInt(e.target.value))}
                      className="w-full"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              ))}
              
              <div className={`p-4 rounded-lg ${pesoTotal === 100 ? 'bg-green-500/20 border border-green-500/50' : 'bg-yellow-500/20 border border-yellow-500/50'}`}>
                <p className="text-white font-medium">
                  Total: {pesoTotal}%
                  {pesoTotal === 100 ? ' ✓' : ' (debe sumar 100%)'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between gap-3">
        <button
          onClick={() => setStep(1)}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors"
        >
          Anterior
        </button>
        <button
          onClick={() => setStep(3)}
          disabled={temasSeleccionados.length === 0 || pesoTotal !== 100}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Siguiente
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">🎯 Configuración de Preguntas</h2>
      
      {/* Selector de Tipos de Preguntas */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Tipos de Preguntas</h3>
        <div className="grid grid-cols-2 gap-4">
          {TIPOS_PREGUNTA.map(tipo => (
            <div
              key={tipo.id}
              className={`p-5 border-2 rounded-lg transition-all cursor-pointer ${
                tiposSeleccionados[tipo.id as QuestionType] > 0
                  ? 'bg-blue-500/20 border-blue-500'
                  : 'bg-white/5 border-white/10 hover:border-white/30'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{tipo.icono}</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{tipo.nombre}</h4>
                  <p className="text-sm text-white/60">{tipo.descripcion}</p>
                </div>
              </div>
              
              {tiposSeleccionados[tipo.id as QuestionType] > 0 && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleChangeTipoCantidad(tipo.id as QuestionType, tiposSeleccionados[tipo.id as QuestionType] - 1)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <span className="text-white font-semibold flex-1 text-center">
                    {tiposSeleccionados[tipo.id as QuestionType]} preguntas
                  </span>
                  <button
                    onClick={() => handleChangeTipoCantidad(tipo.id as QuestionType, tiposSeleccionados[tipo.id as QuestionType] + 1)}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                </div>
              )}
              
              {tiposSeleccionados[tipo.id as QuestionType] === 0 && (
                <button
                  onClick={() => handleChangeTipoCantidad(tipo.id as QuestionType, 1)}
                  className="w-full mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                >
                  Agregar
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Distribución de Dificultad */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Distribución de Dificultad</h3>
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="text-sm text-white/60 mb-2 block">
                Fácil ({Math.floor(totalPreguntas * distribucionDificultad.facil / 100)} preguntas)
              </label>
              <input
                type="range"
                value={distribucionDificultad.facil}
                onChange={(e) => setDistribucionDificultad(prev => ({
                  ...prev,
                  facil: parseInt(e.target.value)
                }))}
                className="w-full"
                min="0"
                max="100"
              />
              <p className="text-center text-white font-semibold mt-2">{distribucionDificultad.facil}%</p>
            </div>
            
            <div>
              <label className="text-sm text-white/60 mb-2 block">
                Media ({Math.floor(totalPreguntas * distribucionDificultad.media / 100)} preguntas)
              </label>
              <input
                type="range"
                value={distribucionDificultad.media}
                onChange={(e) => setDistribucionDificultad(prev => ({
                  ...prev,
                  media: parseInt(e.target.value)
                }))}
                className="w-full"
                min="0"
                max="100"
              />
              <p className="text-center text-white font-semibold mt-2">{distribucionDificultad.media}%</p>
            </div>
            
            <div>
              <label className="text-sm text-white/60 mb-2 block">
                Difícil ({Math.floor(totalPreguntas * distribucionDificultad.dificil / 100)} preguntas)
              </label>
              <input
                type="range"
                value={distribucionDificultad.dificil}
                onChange={(e) => setDistribucionDificultad(prev => ({
                  ...prev,
                  dificil: parseInt(e.target.value)
                }))}
                className="w-full"
                min="0"
                max="100"
              />
              <p className="text-center text-white font-semibold mt-2">{distribucionDificultad.dificil}%</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Resumen */}
      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">📊 Resumen</h3>
        <div className="grid grid-cols-4 gap-6">
          <div>
            <p className="text-white/60 text-sm mb-1">Total Preguntas</p>
            <p className="text-2xl font-bold text-white">{totalPreguntas}</p>
          </div>
          <div>
            <p className="text-white/60 text-sm mb-1">Puntos Totales</p>
            <p className="text-2xl font-bold text-white">{totalPreguntas * 2}</p>
          </div>
          <div>
            <p className="text-white/60 text-sm mb-1">Duración Estimada</p>
            <p className="text-2xl font-bold text-white">{duracionEstimada} min</p>
          </div>
          <div>
            <p className="text-white/60 text-sm mb-1">Temas Cubiertos</p>
            <p className="text-2xl font-bold text-white">{temasSeleccionados.length}</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between gap-3">
        <button
          onClick={() => setStep(2)}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors"
        >
          Anterior
        </button>
        <button
          onClick={handleGenerarPreguntas}
          disabled={totalPreguntas === 0}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-5 h-5" />
          Generar Preguntas
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">✏️ Preguntas Generadas</h2>
        <button
          onClick={handleGenerarPreguntas}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Regenerar
        </button>
      </div>
      
      <div className="space-y-4">
        {preguntas.map((pregunta, index) => (
          <div key={pregunta.id} className="bg-white/5 border border-white/10 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-white font-bold">#{index + 1}</span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                  {TIPOS_PREGUNTA.find(t => t.id === pregunta.tipo)?.nombre}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  pregunta.dificultad === 'facil' ? 'bg-green-500/20 text-green-400' :
                  pregunta.dificultad === 'media' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {pregunta.dificultad}
                </span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
                  {pregunta.puntos} pts
                </span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4 text-white/60" />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 text-white/60" />
                </button>
              </div>
            </div>
            
            <p className="text-white font-medium text-lg mb-4">{pregunta.pregunta}</p>
            
            {pregunta.opciones && (
              <div className="space-y-2">
                {pregunta.opciones.map(opcion => (
                  <div
                    key={opcion.id}
                    className={`p-3 rounded-lg ${
                      opcion.esCorrecta
                        ? 'bg-green-500/20 border border-green-500/50'
                        : 'bg-white/5 border border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white">{opcion.id.toUpperCase()})</span>
                      <span className="text-white/80">{opcion.texto}</span>
                      {opcion.esCorrecta && (
                        <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {pregunta.retroalimentacion && (
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-blue-400 text-sm">
                  <strong>Retroalimentación:</strong> {pregunta.retroalimentacion}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex justify-between gap-3">
        <button
          onClick={() => setStep(3)}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors"
        >
          Anterior
        </button>
        <button
          onClick={() => setStep(5)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Vista Previa
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">👁️ Vista Previa y Publicación</h2>
      
      <div className="grid grid-cols-3 gap-6">
        {/* Preview del Examen */}
        <div className="col-span-2">
          <div className="bg-white/5 border border-white/10 rounded-lg p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">{config.nombre}</h1>
              <div className="flex items-center gap-4 text-white/60">
                <span>📚 {config.materia}</span>
                <span>📅 {config.fecha?.toLocaleDateString('es-ES')}</span>
                <span>⏱️ {config.duracion} minutos</span>
                <span>⭐ {preguntas.reduce((sum, p) => sum + p.puntos, 0)} puntos</span>
              </div>
            </div>
            
            <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <h3 className="font-semibold text-white mb-2">Instrucciones</h3>
              <ul className="text-white/80 space-y-1 text-sm">
                <li>• Lee cada pregunta cuidadosamente</li>
                <li>• Marca tus respuestas claramente</li>
                <li>• Revisa tus respuestas antes de entregar</li>
                <li>• Tienes {config.duracion} minutos para completar el examen</li>
              </ul>
            </div>
            
            <div className="space-y-6">
              {preguntas.map((pregunta, index) => (
                <div key={pregunta.id} className="pb-6 border-b border-white/10 last:border-0">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="font-bold text-white">{index + 1}.</span>
                    <div className="flex-1">
                      <p className="text-white text-lg mb-2">{pregunta.pregunta}</p>
                      <span className="text-white/60 text-sm">({pregunta.puntos} puntos)</span>
                    </div>
                  </div>
                  
                  {pregunta.opciones && (
                    <div className="ml-6 space-y-2">
                      {pregunta.opciones.map(opcion => (
                        <div
                          key={opcion.id}
                          className={`p-3 rounded-lg border ${
                            mostrarRespuestas && opcion.esCorrecta
                              ? 'bg-green-500/20 border-green-500'
                              : 'bg-white/5 border-white/10'
                          }`}
                        >
                          <span className="text-white">
                            {opcion.id.toUpperCase()}) {opcion.texto}
                            {mostrarRespuestas && opcion.esCorrecta && ' ✓'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-2">
            <input
              type="checkbox"
              id="showAnswers"
              checked={mostrarRespuestas}
              onChange={(e) => setMostrarRespuestas(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="showAnswers" className="text-white/80 text-sm">
              Mostrar respuestas correctas
            </label>
          </div>
        </div>
        
        {/* Panel de Acciones */}
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold text-white mb-4">Acciones</h3>
            
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/20 hover:bg-white/10 text-white rounded-lg transition-colors">
                <Download className="w-5 h-5" />
                Exportar PDF
              </button>
              
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/20 hover:bg-white/10 text-white rounded-lg transition-colors">
                <Copy className="w-5 h-5" />
                Copiar Enlace
              </button>
            </div>
          </Card>
          
          <Card className="p-6">
            <h3 className="font-semibold text-white mb-4">Configuración</h3>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.barajarPreguntas}
                  onChange={(e) => setConfig(prev => ({ ...prev, barajarPreguntas: e.target.checked }))}
                  className="w-4 h-4"
                />
                <span className="text-white/80 text-sm">Barajar preguntas</span>
              </label>
              
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.barajarOpciones}
                  onChange={(e) => setConfig(prev => ({ ...prev, barajarOpciones: e.target.checked }))}
                  className="w-4 h-4"
                />
                <span className="text-white/80 text-sm">Barajar opciones</span>
              </label>
              
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.mostrarResultados}
                  onChange={(e) => setConfig(prev => ({ ...prev, mostrarResultados: e.target.checked }))}
                  className="w-4 h-4"
                />
                <span className="text-white/80 text-sm">Mostrar resultados al terminar</span>
              </label>
            </div>
          </Card>
          
          <div className="space-y-3">
            <button
              onClick={handleGuardarExamen}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-medium text-lg transition-colors"
            >
              <Send className="w-5 h-5" />
              Publicar Examen
            </button>
            
            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors">
              <Save className="w-5 h-5" />
              Guardar Borrador
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between gap-3">
        <button
          onClick={() => setStep(4)}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors"
        >
          Anterior
        </button>
      </div>
    </div>
  );

  // ============================
  // RENDER PRINCIPAL
  // ============================

  if (generando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-6">
        <Card className="p-12 text-center max-w-md">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mb-6"
          >
            <Sparkles className="w-16 h-16 text-blue-400 mx-auto" />
          </motion.div>
          <h3 className="text-2xl font-bold text-white mb-3">Generando Preguntas con IA</h3>
          <p className="text-white/60 mb-6">Esto puede tomar unos segundos...</p>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3 }}
            />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header con Steps */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-6">📝 Crear Examen Mejorado</h1>
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {[
              { num: 1, label: 'Configuración' },
              { num: 2, label: 'Temas' },
              { num: 3, label: 'Preguntas' },
              { num: 4, label: 'Edición' },
              { num: 5, label: 'Publicación' }
            ].map((s, index) => (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    step >= s.num
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-white/40'
                  }`}>
                    {s.num}
                  </div>
                  <span className={`text-sm ${step >= s.num ? 'text-white' : 'text-white/40'}`}>
                    {s.label}
                  </span>
                </div>
                {index < 4 && (
                  <div className={`flex-1 h-1 ${step > s.num ? 'bg-blue-600' : 'bg-white/10'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Contenido del Step Actual */}
        <Card className="p-8">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
          {step === 5 && renderStep5()}
        </Card>
      </div>
    </div>
  );
};
