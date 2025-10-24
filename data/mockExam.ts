export type MockQ = {
  id: string;
  area: 'Matemáticas' | 'Comprensión Lectora';
  topic: string;
  text: string;
  options: string[];
  correctIndex: number;
};

export const MOCK_QS_MATE: MockQ[] = [
  {
    id: 'MOCK_M01',
    area: 'Matemáticas',
    topic: 'Álgebra',
    text: 'Si $$2x + y = 7$$ y $$x - y = 2$$, ¿cuál es el valor de x?',
    options: ['3', '2', '5', '1'],
    correctIndex: 0,
  },
  {
    id: 'MOCK_M02',
    area: 'Matemáticas',
    topic: 'Cálculo',
    text: 'Encuentra la primera derivada de $$f(x) = \\ln(x^2)$$.',
    options: ['$$2/x$$', '$$1/x^2$$', '$$2x$$', '$$2 \\ln(x)$$'],
    correctIndex: 0,
  },
  {
    id: 'MOCK_M03',
    area: 'Matemáticas',
    topic: 'Geometría Analítica',
    text: '¿Cuál es la pendiente de la recta que pasa por los puntos (1, 2) y (5, 10)?',
    options: ['1/2', '4', '8', '2'],
    correctIndex: 3,
  },
  {
    id: 'MOCK_M04',
    area: 'Matemáticas',
    topic: 'Trigonometría',
    text: 'Si $$\\sin(\\theta) = \\frac{3}{5}$$ y $$\\theta$$ está en el primer cuadrante, ¿cuál es el valor de $$\\cos(\\theta)$$?',
    options: ['4/5', '3/4', '5/3', '2/5'],
    correctIndex: 0,
  },
  {
    id: 'MOCK_M05',
    area: 'Matemáticas',
    topic: 'Probabilidad',
    text: 'En una urna hay 5 bolas rojas y 3 azules. ¿Cuál es la probabilidad de sacar una bola roja?',
    options: ['3/8', '5/3', '5/8', '1/5'],
    correctIndex: 2,
  },
   {
    id: 'MOCK_M06',
    area: 'Matemáticas',
    topic: 'Ecuaciones',
    text: 'Resuelve la ecuación cuadrática: $$x^2 - 4x - 5 = 0$$',
    options: ['x=5, x=-1', 'x=-5, x=1', 'x=4, x=1', 'x=5, x=1'],
    correctIndex: 0,
  },
   {
    id: 'MOCK_M07',
    area: 'Matemáticas',
    topic: 'Fracciones',
    text: 'Calcula: $$\\frac{\\frac{1}{2} + \\frac{1}{3}}{\\frac{1}{4}}$$',
    options: ['5/6', '10/3', '2/5', '5/24'],
    correctIndex: 1,
  },
];

export const MOCK_QS_LENG: MockQ[] = [
  {
    id: 'MOCK_L01',
    area: 'Comprensión Lectora',
    topic: 'Idea Principal',
    text: 'La Revolución Industrial, que comenzó en Gran Bretaña en el siglo XVIII, fue un período de grandes cambios tecnológicos, sociales y económicos. La invención de la máquina de vapor fue un catalizador clave que impulsó la producción en masa en fábricas, lo que a su vez provocó una migración masiva de la población rural a las ciudades. ¿Cuál fue el principal motor de la Revolución Industrial mencionado en el texto?',
    options: ['La migración a las ciudades', 'Los cambios sociales', 'La máquina de vapor', 'La producción en masa'],
    correctIndex: 2,
  },
  {
    id: 'MOCK_L02',
    area: 'Comprensión Lectora',
    topic: 'Cohesión',
    text: 'El autor presenta varios argumentos. ______, no todos son convincentes. ¿Qué conector completa mejor la idea?',
    options: ['Por lo tanto', 'Sin embargo', 'Además', 'Es decir'],
    correctIndex: 1,
  },
  {
    id: 'MOCK_L03',
    area: 'Comprensión Lectora',
    topic: 'Inferencias',
    text: 'El informe meteorológico anunciaba cielos despejados, pero al salir, Marta vio a todos con paraguas y abrigos. ¿Qué puede inferir Marta?',
    options: ['El informe estaba equivocado', 'La gente está exagerando', 'Va a hacer mucho calor', 'Es de noche'],
    correctIndex: 0,
  },
];
