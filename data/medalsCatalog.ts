import type { Medalla } from '../types';

// ============================================
// CATÁLOGO DE MEDALLAS - CIENTÍFICOS FAMOSOS
// ============================================

export const MEDALLAS_CATALOG: Medalla[] = [
  // ==================== MATEMÁTICAS ====================
  {
    id: 'medal-pitagoras',
    nombre: 'Medalla Pitágoras',
    descripcion: 'Dominio de geometría básica',
    cientifico: {
      nombre: 'Pitágoras',
      imagen: '/assets/scientists/pitagoras.jpg',
      bio: 'Filósofo y matemático griego, fundador de la escuela pitagórica',
      logro: 'Teorema de Pitágoras: a² + b² = c²',
      fechaNacimiento: '570 a.C.',
      nacionalidad: 'Grecia'
    },
    materia: 'matematicas',
    tipo: 'examen',
    nivel: 'bronze',
    xpRequerido: 100,
    criterio: 'Aprobar examen de geometría con ≥70%',
    rareza: 'common',
    icono: '📐',
    color: '#CD7F32',
    otorgadaA: [],
    totalOtorgadas: 0,
    createdAt: new Date()
  },
  {
    id: 'medal-euclides',
    nombre: 'Medalla Euclides',
    descripcion: 'Maestro de la geometría avanzada',
    cientifico: {
      nombre: 'Euclides',
      imagen: '/assets/scientists/euclides.jpg',
      bio: 'Matemático griego, padre de la geometría',
      logro: 'Autor de "Los Elementos", obra fundamental de geometría',
      fechaNacimiento: '325 a.C.',
      nacionalidad: 'Grecia'
    },
    materia: 'matematicas',
    tipo: 'examen',
    nivel: 'silver',
    xpRequerido: 500,
    criterio: 'Aprobar examen de geometría avanzada con ≥80%',
    rareza: 'rare',
    icono: '📏',
    color: '#C0C0C0',
    otorgadaA: [],
    totalOtorgadas: 0,
    createdAt: new Date()
  },
  {
    id: 'medal-newton-math',
    nombre: 'Medalla Isaac Newton',
    descripcion: 'Genio del cálculo',
    cientifico: {
      nombre: 'Isaac Newton',
      imagen: '/assets/scientists/newton.jpg',
      bio: 'Físico y matemático inglés, uno de los científicos más influyentes',
      logro: 'Desarrolló el cálculo infinitesimal',
      fechaNacimiento: '1643',
      nacionalidad: 'Inglaterra'
    },
    materia: 'matematicas',
    tipo: 'examen',
    nivel: 'gold',
    xpRequerido: 1000,
    criterio: 'Aprobar examen de cálculo con ≥85%',
    rareza: 'epic',
    icono: '🍎',
    color: '#FFD700',
    otorgadaA: [],
    totalOtorgadas: 0,
    createdAt: new Date()
  },
  {
    id: 'medal-gauss',
    nombre: 'Medalla Carl Gauss',
    descripcion: 'Príncipe de las matemáticas',
    cientifico: {
      nombre: 'Carl Friedrich Gauss',
      imagen: '/assets/scientists/gauss.jpg',
      bio: 'Matemático alemán, considerado uno de los más grandes de todos los tiempos',
      logro: 'Contribuciones en teoría de números, geometría y estadística',
      fechaNacimiento: '1777',
      nacionalidad: 'Alemania'
    },
    materia: 'matematicas',
    tipo: 'examen',
    nivel: 'platinum',
    xpRequerido: 2500,
    criterio: 'Aprobar examen de matemáticas avanzadas con ≥90%',
    rareza: 'legendary',
    icono: '🎖️',
    color: '#E5E4E2',
    otorgadaA: [],
    totalOtorgadas: 0,
    createdAt: new Date()
  },
  {
    id: 'medal-emmy-noether',
    nombre: 'Medalla Emmy Noether',
    descripcion: 'Pionera del álgebra abstracta',
    cientifico: {
      nombre: 'Emmy Noether',
      imagen: '/assets/scientists/noether.jpg',
      bio: 'Matemática alemana, revolucionó el álgebra abstracta',
      logro: 'Teorema de Noether: simetría y leyes de conservación',
      fechaNacimiento: '1882',
      nacionalidad: 'Alemania'
    },
    materia: 'matematicas',
    tipo: 'examen',
    nivel: 'diamond',
    xpRequerido: 5000,
    criterio: 'Completar curso avanzado de álgebra con ≥95%',
    rareza: 'mythic',
    icono: '💎',
    color: '#B9F2FF',
    otorgadaA: [],
    totalOtorgadas: 0,
    createdAt: new Date()
  },

  // ==================== FÍSICA ====================
  {
    id: 'medal-galileo',
    nombre: 'Medalla Galileo Galilei',
    descripcion: 'Padre de la física moderna',
    cientifico: {
      nombre: 'Galileo Galilei',
      imagen: '/assets/scientists/galileo.jpg',
      bio: 'Astrónomo, físico e ingeniero italiano',
      logro: 'Perfeccionó el telescopio y descubrió las lunas de Júpiter',
      fechaNacimiento: '1564',
      nacionalidad: 'Italia'
    },
    materia: 'fisica',
    tipo: 'examen',
    nivel: 'bronze',
    xpRequerido: 100,
    criterio: 'Aprobar examen de mecánica básica con ≥70%',
    rareza: 'common',
    icono: '🔭',
    color: '#CD7F32',
    otorgadaA: [],
    totalOtorgadas: 0,
    createdAt: new Date()
  },
  {
    id: 'medal-newton-physics',
    nombre: 'Medalla Isaac Newton (Física)',
    descripcion: 'Maestro de las leyes del movimiento',
    cientifico: {
      nombre: 'Isaac Newton',
      imagen: '/assets/scientists/newton.jpg',
      bio: 'Físico y matemático inglés',
      logro: 'Tres leyes del movimiento y Ley de Gravitación Universal',
      fechaNacimiento: '1643',
      nacionalidad: 'Inglaterra'
    },
    materia: 'fisica',
    tipo: 'examen',
    nivel: 'silver',
    xpRequerido: 500,
    criterio: 'Aprobar examen de leyes de Newton con ≥80%',
    rareza: 'rare',
    icono: '⚖️',
    color: '#C0C0C0',
    otorgadaA: [],
    totalOtorgadas: 0,
    createdAt: new Date()
  },
  {
    id: 'medal-einstein',
    nombre: 'Medalla Albert Einstein',
    descripcion: 'Genio de la relatividad',
    cientifico: {
      nombre: 'Albert Einstein',
      imagen: '/assets/scientists/einstein.jpg',
      bio: 'Físico alemán, desarrolló la teoría de la relatividad',
      logro: 'E = mc² - Equivalencia entre masa y energía',
      fechaNacimiento: '1879',
      nacionalidad: 'Alemania'
    },
    materia: 'fisica',
    tipo: 'examen',
    nivel: 'gold',
    xpRequerido: 1000,
    criterio: 'Aprobar examen de física moderna con ≥85%',
    rareza: 'epic',
    icono: '⚛️',
    color: '#FFD700',
    otorgadaA: [],
    totalOtorgadas: 0,
    createdAt: new Date()
  },
  {
    id: 'medal-feynman',
    nombre: 'Medalla Richard Feynman',
    descripcion: 'Maestro de la física cuántica',
    cientifico: {
      nombre: 'Richard Feynman',
      imagen: '/assets/scientists/feynman.jpg',
      bio: 'Físico estadounidense, pionero de la electrodinámica cuántica',
      logro: 'Diagramas de Feynman - Visualización de interacciones cuánticas',
      fechaNacimiento: '1918',
      nacionalidad: 'Estados Unidos'
    },
    materia: 'fisica',
    tipo: 'examen',
    nivel: 'platinum',
    xpRequerido: 2500,
    criterio: 'Aprobar examen de física cuántica con ≥90%',
    rareza: 'legendary',
    icono: '🌌',
    color: '#E5E4E2',
    otorgadaA: [],
    totalOtorgadas: 0,
    createdAt: new Date()
  },
  {
    id: 'medal-hawking',
    nombre: 'Medalla Stephen Hawking',
    descripcion: 'Explorador del cosmos',
    cientifico: {
      nombre: 'Stephen Hawking',
      imagen: '/assets/scientists/hawking.jpg',
      bio: 'Físico teórico británico, experto en agujeros negros',
      logro: 'Radiación de Hawking - Agujeros negros emiten radiación',
      fechaNacimiento: '1942',
      nacionalidad: 'Reino Unido'
    },
    materia: 'fisica',
    tipo: 'examen',
    nivel: 'diamond',
    xpRequerido: 5000,
    criterio: 'Completar curso de astrofísica con ≥95%',
    rareza: 'mythic',
    icono: '🌠',
    color: '#B9F2FF',
    otorgadaA: [],
    totalOtorgadas: 0,
    createdAt: new Date()
  },

  // ==================== QUÍMICA ====================
  {
    id: 'medal-lavoisier',
    nombre: 'Medalla Antoine Lavoisier',
    descripcion: 'Padre de la química moderna',
    cientifico: {
      nombre: 'Antoine Lavoisier',
      imagen: '/assets/scientists/lavoisier.jpg',
      bio: 'Químico francés, estableció la ley de conservación de la masa',
      logro: 'Descubrió el papel del oxígeno en la combustión',
      fechaNacimiento: '1743',
      nacionalidad: 'Francia'
    },
    materia: 'quimica',
    tipo: 'examen',
    nivel: 'bronze',
    xpRequerido: 100,
    criterio: 'Aprobar examen de química básica con ≥70%',
    rareza: 'common',
    icono: '⚗️',
    color: '#CD7F32',
    otorgadaA: [],
    totalOtorgadas: 0,
    createdAt: new Date()
  },
  {
    id: 'medal-mendeleev',
    nombre: 'Medalla Dmitri Mendeléyev',
    descripcion: 'Creador de la tabla periódica',
    cientifico: {
      nombre: 'Dmitri Mendeléyev',
      imagen: '/assets/scientists/mendeleev.jpg',
      bio: 'Químico ruso, creó la tabla periódica de elementos',
      logro: 'Predijo elementos aún no descubiertos basándose en su tabla',
      fechaNacimiento: '1834',
      nacionalidad: 'Rusia'
    },
    materia: 'quimica',
    tipo: 'examen',
    nivel: 'silver',
    xpRequerido: 500,
    criterio: 'Dominar tabla periódica con ≥80%',
    rareza: 'rare',
    icono: '🧪',
    color: '#C0C0C0',
    otorgadaA: [],
    totalOtorgadas: 0,
    createdAt: new Date()
  },
  {
    id: 'medal-marie-curie',
    nombre: 'Medalla Marie Curie',
    descripcion: 'Pionera de la radioactividad',
    cientifico: {
      nombre: 'Marie Curie',
      imagen: '/assets/scientists/marie-curie.jpg',
      bio: 'Física y química polaca, primera mujer en ganar un Premio Nobel',
      logro: 'Descubrió el Polonio y el Radio, ganó 2 Premios Nobel',
      fechaNacimiento: '1867',
      nacionalidad: 'Polonia / Francia'
    },
    materia: 'quimica',
    tipo: 'examen',
    nivel: 'gold',
    xpRequerido: 1000,
    criterio: 'Aprobar examen de química avanzada con ≥90%',
    rareza: 'epic',
    icono: '☢️',
    color: '#FFD700',
    otorgadaA: [],
    totalOtorgadas: 0,
    createdAt: new Date()
  },
  {
    id: 'medal-linus-pauling',
    nombre: 'Medalla Linus Pauling',
    descripcion: 'Genio de los enlaces químicos',
    cientifico: {
      nombre: 'Linus Pauling',
      imagen: '/assets/scientists/pauling.jpg',
      bio: 'Químico estadounidense, experto en enlaces químicos',
      logro: 'Único ganador de 2 Premios Nobel sin compartir',
      fechaNacimiento: '1901',
      nacionalidad: 'Estados Unidos'
    },
    materia: 'quimica',
    tipo: 'examen',
    nivel: 'platinum',
    xpRequerido: 2500,
    criterio: 'Dominar química orgánica con ≥90%',
    rareza: 'legendary',
    icono: '🔬',
    color: '#E5E4E2',
    otorgadaA: [],
    totalOtorgadas: 0,
    createdAt: new Date()
  },
  {
    id: 'medal-dorothy-hodgkin',
    nombre: 'Medalla Dorothy Hodgkin',
    descripcion: 'Maestra de la cristalografía',
    cientifico: {
      nombre: 'Dorothy Hodgkin',
      imagen: '/assets/scientists/hodgkin.jpg',
      bio: 'Química británica, desarrolló cristalografía de rayos X',
      logro: 'Descubrió la estructura de la penicilina y vitamina B12',
      fechaNacimiento: '1910',
      nacionalidad: 'Reino Unido'
    },
    materia: 'quimica',
    tipo: 'examen',
    nivel: 'diamond',
    xpRequerido: 5000,
    criterio: 'Completar curso de bioquímica con ≥95%',
    rareza: 'mythic',
    icono: '💎',
    color: '#B9F2FF',
    otorgadaA: [],
    totalOtorgadas: 0,
    createdAt: new Date()
  },

  // ==================== BIOLOGÍA ====================
  {
    id: 'medal-linnaeus',
    nombre: 'Medalla Carl Linnaeus',
    descripcion: 'Padre de la taxonomía',
    cientifico: {
      nombre: 'Carl Linnaeus',
      imagen: '/assets/scientists/linnaeus.jpg',
      bio: 'Naturalista sueco, creó el sistema de nomenclatura binomial',
      logro: 'Sistema de clasificación de especies aún usado hoy',
      fechaNacimiento: '1707',
      nacionalidad: 'Suecia'
    },
    materia: 'biologia',
    tipo: 'examen',
    nivel: 'bronze',
    xpRequerido: 100,
    criterio: 'Aprobar examen de clasificación con ≥70%',
    rareza: 'common',
    icono: '🌿',
    color: '#CD7F32',
    otorgadaA: [],
    totalOtorgadas: 0,
    createdAt: new Date()
  },
  {
    id: 'medal-darwin',
    nombre: 'Medalla Charles Darwin',
    descripcion: 'Padre de la evolución',
    cientifico: {
      nombre: 'Charles Darwin',
      imagen: '/assets/scientists/darwin.jpg',
      bio: 'Naturalista inglés, propuso la teoría de la evolución',
      logro: 'Selección natural - Mecanismo de la evolución',
      fechaNacimiento: '1809',
      nacionalidad: 'Inglaterra'
    },
    materia: 'biologia',
    tipo: 'examen',
    nivel: 'silver',
    xpRequerido: 500,
    criterio: 'Aprobar examen de evolución con ≥80%',
    rareza: 'rare',
    icono: '🦎',
    color: '#C0C0C0',
    otorgadaA: [],
    totalOtorgadas: 0,
    createdAt: new Date()
  },
  {
    id: 'medal-mendel',
    nombre: 'Medalla Gregor Mendel',
    descripcion: 'Padre de la genética',
    cientifico: {
      nombre: 'Gregor Mendel',
      imagen: '/assets/scientists/mendel.jpg',
      bio: 'Monje agustino y científico checo, fundador de la genética',
      logro: 'Leyes de Mendel - Herencia genética',
      fechaNacimiento: '1822',
      nacionalidad: 'Austria'
    },
    materia: 'biologia',
    tipo: 'examen',
    nivel: 'gold',
    xpRequerido: 1000,
    criterio: 'Aprobar examen de genética con ≥85%',
    rareza: 'epic',
    icono: '🧬',
    color: '#FFD700',
    otorgadaA: [],
    totalOtorgadas: 0,
    createdAt: new Date()
  },
  {
    id: 'medal-jane-goodall',
    nombre: 'Medalla Jane Goodall',
    descripcion: 'Pionera de la primatología',
    cientifico: {
      nombre: 'Jane Goodall',
      imagen: '/assets/scientists/goodall.jpg',
      bio: 'Primatóloga británica, experta en chimpancés',
      logro: 'Revolucionó el estudio del comportamiento animal',
      fechaNacimiento: '1934',
      nacionalidad: 'Reino Unido'
    },
    materia: 'biologia',
    tipo: 'examen',
    nivel: 'platinum',
    xpRequerido: 2500,
    criterio: 'Aprobar examen de etología con ≥90%',
    rareza: 'legendary',
    icono: '🦧',
    color: '#E5E4E2',
    otorgadaA: [],
    totalOtorgadas: 0,
    createdAt: new Date()
  },
  {
    id: 'medal-rosalind-franklin',
    nombre: 'Medalla Rosalind Franklin',
    descripcion: 'Descubridora de la estructura del ADN',
    cientifico: {
      nombre: 'Rosalind Franklin',
      imagen: '/assets/scientists/franklin.jpg',
      bio: 'Química británica, contribuyó al descubrimiento del ADN',
      logro: 'Fotografía 51 - Imagen clave de la estructura del ADN',
      fechaNacimiento: '1920',
      nacionalidad: 'Reino Unido'
    },
    materia: 'biologia',
    tipo: 'examen',
    nivel: 'diamond',
    xpRequerido: 5000,
    criterio: 'Completar curso de biología molecular con ≥95%',
    rareza: 'mythic',
    icono: '🧬',
    color: '#B9F2FF',
    otorgadaA: [],
    totalOtorgadas: 0,
    createdAt: new Date()
  },

  // ==================== JUEGOS COGNITIVOS ====================
  {
    id: 'medal-ebbinghaus',
    nombre: 'Medalla Hermann Ebbinghaus',
    descripcion: 'Maestro de la memoria',
    cientifico: {
      nombre: 'Hermann Ebbinghaus',
      imagen: '/assets/scientists/ebbinghaus.jpg',
      bio: 'Psicólogo alemán, pionero del estudio de la memoria',
      logro: 'Curva del olvido - Cómo olvidamos información con el tiempo',
      fechaNacimiento: '1850',
      nacionalidad: 'Alemania'
    },
    tipo: 'juego',
    nivel: 'gold',
    xpRequerido: 1000,
    criterio: 'Alcanzar 90% de precisión en juegos de memoria',
    rareza: 'epic',
    icono: '🧠',
    color: '#FFD700',
    otorgadaA: [],
    totalOtorgadas: 0,
    createdAt: new Date()
  },
  {
    id: 'medal-william-james',
    nombre: 'Medalla William James',
    descripcion: 'Genio de la atención',
    cientifico: {
      nombre: 'William James',
      imagen: '/assets/scientists/james.jpg',
      bio: 'Psicólogo estadounidense, padre de la psicología americana',
      logro: 'Teoría de la atención selectiva',
      fechaNacimiento: '1842',
      nacionalidad: 'Estados Unidos'
    },
    tipo: 'juego',
    nivel: 'gold',
    xpRequerido: 1000,
    criterio: 'Completar 100 niveles del Stroop Effect',
    rareza: 'epic',
    icono: '👁️',
    color: '#FFD700',
    otorgadaA: [],
    totalOtorgadas: 0,
    createdAt: new Date()
  },
  {
    id: 'medal-piaget',
    nombre: 'Medalla Jean Piaget',
    descripcion: 'Maestro del razonamiento',
    cientifico: {
      nombre: 'Jean Piaget',
      imagen: '/assets/scientists/piaget.jpg',
      bio: 'Psicólogo suizo, teoría del desarrollo cognitivo',
      logro: 'Etapas del desarrollo cognitivo infantil',
      fechaNacimiento: '1896',
      nacionalidad: 'Suiza'
    },
    tipo: 'juego',
    nivel: 'platinum',
    xpRequerido: 2500,
    criterio: 'Resolver 50 puzzles de lógica consecutivos',
    rareza: 'legendary',
    icono: '🎯',
    color: '#E5E4E2',
    otorgadaA: [],
    totalOtorgadas: 0,
    createdAt: new Date()
  },

  // ==================== ESPECIALES ====================
  {
    id: 'medal-perfect-streak',
    nombre: 'Medalla de la Persistencia',
    descripcion: 'Racha perfecta de 30 días',
    cientifico: {
      nombre: 'Benjamin Franklin',
      imagen: '/assets/scientists/franklin.jpg',
      bio: 'Polímata estadounidense: científico, inventor, escritor',
      logro: 'Descubrió la naturaleza eléctrica del rayo',
      fechaNacimiento: '1706',
      nacionalidad: 'Estados Unidos'
    },
    tipo: 'racha',
    nivel: 'diamond',
    xpRequerido: 5000,
    criterio: 'Mantener racha de estudio por 30 días consecutivos',
    rareza: 'mythic',
    icono: '🔥',
    color: '#B9F2FF',
    otorgadaA: [],
    totalOtorgadas: 0,
    createdAt: new Date()
  },
  {
    id: 'medal-all-subjects',
    nombre: 'Medalla del Polímata',
    descripcion: 'Dominio de todas las materias',
    cientifico: {
      nombre: 'Leonardo da Vinci',
      imagen: '/assets/scientists/davinci.jpg',
      bio: 'Polímata del Renacimiento: pintor, científico, ingeniero',
      logro: 'Genio universal en arte, ciencia y tecnología',
      fechaNacimiento: '1452',
      nacionalidad: 'Italia'
    },
    tipo: 'especial',
    nivel: 'diamond',
    xpRequerido: 10000,
    criterio: 'Obtener medalla de oro en todas las materias',
    rareza: 'mythic',
    icono: '🌟',
    color: '#B9F2FF',
    otorgadaA: [],
    totalOtorgadas: 0,
    createdAt: new Date()
  }
];

// Helper para obtener medallas por materia
export const getMedalsBySubject = (materia: string): Medalla[] => {
  return MEDALLAS_CATALOG.filter(m => m.materia === materia);
};

// Helper para obtener medallas por nivel
export const getMedalsByLevel = (nivel: Medalla['nivel']): Medalla[] => {
  return MEDALLAS_CATALOG.filter(m => m.nivel === nivel);
};

// Helper para obtener medallas por tipo
export const getMedalsByType = (tipo: Medalla['tipo']): Medalla[] => {
  return MEDALLAS_CATALOG.filter(m => m.tipo === tipo);
};

export default MEDALLAS_CATALOG;
