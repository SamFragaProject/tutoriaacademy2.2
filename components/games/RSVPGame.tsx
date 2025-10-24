import React, { useState, useEffect, useCallback } from 'react';
import { Card, PrimaryButton } from '../ui';
import type { GradeLevel } from '../../types';

const GAME_DURATION = 60;

// Configuración adaptativa por nivel educativo
const LEVEL_CONFIG = {
  primaria: {
    wpmMin: 100,
    wpmMax: 250,
    wpmDefault: 150,
    instructions: 'Las palabras aparecerán una por una. Lee rápido y responde la pregunta al final. ¡Ajusta la velocidad si es muy rápido!'
  },
  secundaria: {
    wpmMin: 150,
    wpmMax: 350,
    wpmDefault: 200,
    instructions: 'Entrenamiento de lectura rápida (RSVP). Ajusta las palabras por minuto y lee el texto. Responde la pregunta de comprensión.'
  },
  preparatoria: {
    wpmMin: 200,
    wpmMax: 500,
    wpmDefault: 300,
    instructions: 'Rapid Serial Visual Presentation para lectura veloz. Maximiza tu WPM manteniendo la comprensión lectora.'
  }
};

// Textos por nivel educativo
const TEXTS_BY_LEVEL = {
  primaria: [
    {
      text: 'El sol brilla en el cielo azul. Los pájaros cantan en los árboles. María juega en el parque con su perro. Le gusta correr y saltar. Su mamá la mira desde un banco. Es un día muy bonito.',
      question: '¿Dónde juega María?',
      options: ['En el parque', 'En su casa', 'En la escuela', 'En la playa'],
      correct: 0
    },
    {
      text: 'Pedro tiene una bicicleta roja. Le gusta mucho andar en ella. Todos los días va a la escuela en su bicicleta. Sus amigos también tienen bicicletas. Juntos van por el camino seguro. Siempre usan casco para protegerse.',
      question: '¿De qué color es la bicicleta de Pedro?',
      options: ['Azul', 'Roja', 'Verde', 'Amarilla'],
      correct: 1
    },
    {
      text: 'La maestra enseña a leer y escribir. En el salón hay muchos libros. Los niños aprenden nuevas palabras cada día. Les gusta hacer dibujos de lo que leen. La lectura es muy importante para aprender cosas nuevas.',
      question: '¿Qué enseña la maestra?',
      options: ['A nadar', 'A leer y escribir', 'A cocinar', 'A bailar'],
      correct: 1
    },
    {
      text: 'En el jardín hay muchas flores de colores. Las abejas vuelan de flor en flor. Buscan el néctar dulce. Las mariposas también visitan las flores. Es importante cuidar las plantas y a los insectos que las visitan.',
      question: '¿Qué buscan las abejas en las flores?',
      options: ['Agua', 'Hojas', 'Néctar', 'Tierra'],
      correct: 2
    },
    {
      text: 'Ana tiene una gata llamada Luna. Luna es blanca con manchas grises. Le gusta dormir en el sol. Por la noche, Luna caza ratones en el jardín. Ana le da comida y agua todos los días.',
      question: '¿Cómo se llama la gata de Ana?',
      options: ['Estrella', 'Luna', 'Nube', 'Nieve'],
      correct: 1
    },
  ],
  secundaria: [
    {
      text: 'La fotosíntesis es el proceso mediante el cual las plantas convierten la luz solar en energía química. Durante este proceso, las plantas absorben dióxido de carbono del aire y agua del suelo. Usando la energía de la luz solar, transforman estos elementos en glucosa y oxígeno. El oxígeno es liberado a la atmósfera, mientras que la glucosa se utiliza como alimento para la planta.',
      question: '¿Qué gas liberan las plantas durante la fotosíntesis?',
      options: ['Dióxido de carbono', 'Oxígeno', 'Nitrógeno', 'Hidrógeno'],
      correct: 1
    },
    {
      text: 'El ciclo del agua es fundamental para la vida en la Tierra. El sol calienta el agua de océanos, ríos y lagos, causando evaporación. El vapor se eleva a la atmósfera donde se enfría y condensa formando nubes. Cuando las gotas de agua en las nubes se vuelven muy pesadas, caen como precipitación en forma de lluvia, nieve o granizo.',
      question: '¿Qué causa la evaporación del agua?',
      options: ['El viento', 'La luna', 'El calor del sol', 'Las plantas'],
      correct: 2
    },
    {
      text: 'Los ecosistemas son comunidades de seres vivos que interactúan entre sí y con su entorno físico. Cada organismo tiene un rol específico en el ecosistema. Los productores, como las plantas, crean su propio alimento. Los consumidores se alimentan de otros organismos. Los descomponedores reciclan nutrientes al descomponer materia orgánica.',
      question: '¿Cuál es la función de los descomponedores?',
      options: ['Crear luz solar', 'Producir oxígeno', 'Reciclar nutrientes', 'Cazar presas'],
      correct: 2
    },
    {
      text: 'La Revolución Industrial marcó un cambio fundamental en la historia humana. Comenzó en Inglaterra en el siglo XVIII con la invención de máquinas que reemplazaron el trabajo manual. Las fábricas aparecieron en las ciudades, atrayendo a trabajadores del campo. Esto transformó la economía, la sociedad y la forma de vida de millones de personas.',
      question: '¿Dónde comenzó la Revolución Industrial?',
      options: ['Francia', 'Alemania', 'Inglaterra', 'España'],
      correct: 2
    },
    {
      text: 'El ADN contiene la información genética de todos los seres vivos. Esta molécula tiene forma de doble hélice y está compuesta por nucleótidos. Los genes son segmentos específicos de ADN que codifican proteínas. Las mutaciones en el ADN pueden resultar en variaciones genéticas que son la base de la evolución.',
      question: '¿Qué forma tiene la molécula de ADN?',
      options: ['Esfera', 'Cubo', 'Doble hélice', 'Pirámide'],
      correct: 2
    },
  ],
  preparatoria: [
    {
      text: 'La teoría de la relatividad de Einstein revolucionó nuestra comprensión del espacio y el tiempo. La relatividad especial propone que las leyes de la física son las mismas para todos los observadores que se mueven a velocidad constante, y que la velocidad de la luz en el vacío es constante. La relatividad general expande esto incluyendo la gravedad, describiendo cómo la masa curva el espacio-tiempo.',
      question: '¿Qué propone la teoría de la relatividad especial sobre la velocidad de la luz?',
      options: ['Es variable según el observador', 'Es constante en el vacío', 'Depende de la gravedad', 'Es infinita'],
      correct: 1
    },
    {
      text: 'La revolución cognitiva en psicología cambió el enfoque del estudio de la mente. Mientras el conductismo se centraba en comportamientos observables, el cognitivismo examina los procesos mentales internos como la percepción, memoria, atención y razonamiento. Este paradigma utiliza modelos computacionales y métodos experimentales para entender cómo procesamos información.',
      question: '¿En qué se centra el paradigma cognitivo?',
      options: ['Solo en comportamientos', 'En procesos mentales internos', 'En emociones únicamente', 'En reflejos automáticos'],
      correct: 1
    },
    {
      text: 'El existencialismo es una corriente filosófica que enfatiza la libertad individual y la responsabilidad personal. Filósofos como Sartre y Camus argumentan que la existencia precede a la esencia, es decir, que nacemos sin un propósito predefinido y debemos crear nuestro propio significado. Esto genera angustia existencial pero también libertad absoluta.',
      question: 'Según el existencialismo, ¿qué precede a la esencia?',
      options: ['La esencia precede a la existencia', 'La existencia precede a la esencia', 'Son simultáneas', 'Ninguna existe realmente'],
      correct: 1
    },
    {
      text: 'La mecánica cuántica describe el comportamiento de partículas a escala atómica y subatómica. A diferencia de la física clásica, los sistemas cuánticos presentan superposición, donde una partícula puede existir en múltiples estados simultáneamente hasta que se observa. El principio de incertidumbre de Heisenberg establece que no podemos conocer con precisión absoluta tanto la posición como el momento de una partícula.',
      question: '¿Qué fenómeno permite que una partícula exista en múltiples estados?',
      options: ['Interferencia', 'Superposición', 'Difracción', 'Refracción'],
      correct: 1
    },
    {
      text: 'La neuroplasticidad es la capacidad del cerebro para reorganizar sus conexiones neuronales. Este fenómeno ocurre a lo largo de toda la vida y es fundamental para el aprendizaje y la recuperación tras lesiones. Las experiencias, el aprendizaje y la práctica pueden fortalecer o debilitar conexiones sinápticas mediante procesos de potenciación y depresión a largo plazo.',
      question: '¿Qué permite la neuroplasticidad cerebral?',
      options: ['Solo crecimiento neuronal', 'Reorganización de conexiones', 'Detener el envejecimiento', 'Eliminar recuerdos'],
      correct: 1
    },
  ]
};

interface RSVPGameProps {
  onGameEnd: (result: any) => void;
  gradeLevel?: GradeLevel;
}

const RSVPGame: React.FC<RSVPGameProps> = ({ onGameEnd, gradeLevel = 'preparatoria' }) => {
  const config = LEVEL_CONFIG[gradeLevel];
  const texts = TEXTS_BY_LEVEL[gradeLevel];

  const [phase, setPhase] = useState<'intro' | 'reading' | 'question' | 'result' | 'ended'>('intro');
  const [wpm, setWpm] = useState(config.wpmDefault);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalTexts, setTotalTexts] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isPaused, setIsPaused] = useState(false);

  // Game timer (pauses during questions)
  useEffect(() => {
    if (phase !== 'reading' && phase !== 'question') return;
    if (phase === 'question') {
      setIsPaused(true);
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setPhase('ended');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [phase]);

  const startReading = () => {
    const text = texts[currentTextIndex];
    const textWords = text.text.split(' ');
    setWords(textWords);
    setCurrentWordIndex(0);
    setOptions(text.options);
    setCorrectAnswer(text.correct);
    setPhase('reading');
    setIsPaused(false);
  };

  // Word advancement
  useEffect(() => {
    if (phase !== 'reading' || isPaused) return;
    const interval = (60 / wpm) * 1000;
    const timer = setInterval(() => {
      setCurrentWordIndex(prev => {
        if (prev >= words.length - 1) {
          setPhase('question');
          return prev;
        }
        return prev + 1;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [phase, wpm, words.length, isPaused]);

  const handleAnswer = (selectedIndex: number) => {
    const isCorrect = selectedIndex === correctAnswer;
    if (isCorrect) {
      const points = wpm * 2;
      setScore(prev => prev + points);
      setPhase('result');
      setTimeout(() => {
        const nextIndex = currentTextIndex + 1;
        if (nextIndex < texts.length) {
          setCurrentTextIndex(nextIndex);
          setTotalTexts(prev => prev + 1);
          startReading();
        } else {
          setPhase('ended');
        }
      }, 1500);
    } else {
      setPhase('result');
      setTimeout(() => {
        const nextIndex = currentTextIndex + 1;
        if (nextIndex < texts.length) {
          setCurrentTextIndex(nextIndex);
          setTotalTexts(prev => prev + 1);
          startReading();
        } else {
          setPhase('ended');
        }
      }, 1500);
    }
  };

  // End game handler
  useEffect(() => {
    if (phase === 'ended') {
      const achievementsUnlocked = [];
      if (score >= 2000) achievementsUnlocked.push('speed_reader_master');
      else if (score >= 1000) achievementsUnlocked.push('speed_reader');

      onGameEnd({
        gameId: 'rsvp-gist',
        gameTitle: 'Lectura Veloz RSVP',
        xpEarned: score,
        metrics: [
          { label: 'Puntuación', value: score.toString() },
          { label: 'Textos Leídos', value: totalTexts.toString() },
          { label: 'WPM', value: wpm.toString() }
        ],
        rawMetrics: { score, wpm, textsRead: totalTexts },
        achievementsUnlocked,
      });
    }
  }, [phase, score, wpm, totalTexts, onGameEnd]);

  if (phase === 'intro') {
    return (
      <div className="flex justify-center items-center min-h-full">
        <Card className="max-w-md w-full text-center">
          <div className="text-4xl mb-4">📖</div>
          <h1 className="text-2xl font-bold text-white mb-2">Lectura Veloz RSVP</h1>
          <div className="inline-block px-3 py-1 rounded-full bg-surface-2 text-sm text-text-secondary mb-4">
            Nivel: {gradeLevel.charAt(0).toUpperCase() + gradeLevel.slice(1)}
          </div>
          <p className="text-text-secondary my-4">{config.instructions}</p>
          
          <div className="my-6">
            <label className="block text-left text-sm text-text-secondary mb-2">
              Velocidad: {wpm} palabras/minuto
            </label>
            <input
              type="range"
              min={config.wpmMin}
              max={config.wpmMax}
              step="10"
              value={wpm}
              onChange={(e) => setWpm(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted mt-1">
              <span>{config.wpmMin} WPM</span>
              <span>{config.wpmMax} WPM</span>
            </div>
          </div>

          <div className="text-sm text-muted mb-4">
            <p>• {texts.length} textos disponibles</p>
            <p>• Responde correctamente para ganar puntos</p>
            <p>• Mayor WPM = más puntos</p>
          </div>

          <PrimaryButton onClick={startReading} className="w-full justify-center">
            Comenzar
          </PrimaryButton>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-full">
      <div className="ta-game-container">
        <div className="flex justify-between items-center text-sm text-text-secondary mb-3">
          <div>Texto {currentTextIndex + 1}/{texts.length}</div>
          <div>Puntos: <span className="font-bold text-info">{score}</span></div>
          <div>Tiempo: <span className="font-bold text-info">{timeLeft}s</span></div>
        </div>

        <div className="w-full bg-surface-2 rounded-full h-2 mb-4">
          <div
            className="bg-accent-b h-2 rounded-full"
            style={{ width: `${(timeLeft / GAME_DURATION) * 100}%`, transition: 'width 1s linear' }}
          ></div>
        </div>

        {phase === 'reading' && (
          <div className="ta-rsvp-display">{words[currentWordIndex]}</div>
        )}

        {phase === 'question' && (
          <div>
            <h3 className="text-lg font-semibold text-center mb-4 text-text-primary">
              {texts[currentTextIndex].question}
            </h3>
            <div className="space-y-3">
              {options.map((opt, i) => (
                <button key={i} onClick={() => handleAnswer(i)} className="ta-option-btn">
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {phase === 'result' && (
          <div className="ta-rsvp-display text-4xl">
            {score > 0 ? '✅ ¡Correcto!' : '❌ Incorrecto'}
          </div>
        )}

        <style>{`
          .ta-game-container {
            width: 100%;
            max-width: 500px;
            padding: 1.5rem;
            background: var(--surface-1);
            border-radius: var(--radius-card);
            border: 1px solid var(--border);
          }
          .ta-rsvp-display {
            height: 200px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 2.5rem;
            font-weight: 600;
            color: var(--text-primary);
            padding: 2rem;
          }
          .ta-option-btn {
            display: block;
            width: 100%;
            padding: 1rem;
            background: var(--surface-2);
            border: 1px solid var(--border);
            border-radius: var(--radius-button);
            text-align: left;
            color: var(--text-primary);
            transition: all 0.2s;
          }
          .ta-option-btn:hover {
            background-color: var(--surface-1);
            border-color: var(--accent-b);
            transform: translateX(4px);
          }
        `}</style>
      </div>
    </div>
  );
};

export default RSVPGame;
