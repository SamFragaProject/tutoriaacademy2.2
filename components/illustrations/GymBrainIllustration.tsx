import React from 'react';
import { motion } from 'framer-motion';

interface GymBrainIllustrationProps {
  className?: string;
}

const GymBrainIllustration: React.FC<GymBrainIllustrationProps> = ({ className = 'w-64 h-64' }) => {
  return (
    <svg 
      viewBox="0 0 300 300" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Gradientes */}
        <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        
        <linearGradient id="weightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e40af" />
        </linearGradient>
        
        <linearGradient id="neuronGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>

        <radialGradient id="glowGrad">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="energyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>

      {/* Glow de fondo pulsante */}
      <motion.circle
        cx="150"
        cy="150"
        r="120"
        fill="url(#glowGrad)"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Ondas de energía */}
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx="150"
          cy="150"
          r="80"
          stroke="url(#energyGrad)"
          strokeWidth="2"
          fill="none"
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{ 
            scale: [0.8, 1.5],
            opacity: [0.8, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            delay: i * 0.7,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Cerebro principal */}
      <motion.g
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
      >
        {/* Hemisferio izquierdo */}
        <motion.path
          d="M120 100 Q100 120 105 145 Q110 170 130 180 Q140 185 150 180 L150 100 Z"
          fill="url(#brainGrad)"
          stroke="#7c3aed"
          strokeWidth="3"
          animate={{ 
            d: [
              "M120 100 Q100 120 105 145 Q110 170 130 180 Q140 185 150 180 L150 100 Z",
              "M120 98 Q98 120 103 145 Q108 172 130 182 Q140 187 150 180 L150 100 Z",
              "M120 100 Q100 120 105 145 Q110 170 130 180 Q140 185 150 180 L150 100 Z"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Hemisferio derecho */}
        <motion.path
          d="M180 100 Q200 120 195 145 Q190 170 170 180 Q160 185 150 180 L150 100 Z"
          fill="url(#brainGrad)"
          stroke="#7c3aed"
          strokeWidth="3"
          animate={{ 
            d: [
              "M180 100 Q200 120 195 145 Q190 170 170 180 Q160 185 150 180 L150 100 Z",
              "M180 98 Q202 120 197 145 Q192 172 170 182 Q160 187 150 180 L150 100 Z",
              "M180 100 Q200 120 195 145 Q190 170 170 180 Q160 185 150 180 L150 100 Z"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
        />

        {/* Surcos cerebrales */}
        {[
          "M110 115 Q115 120 120 115",
          "M115 130 Q120 135 125 130",
          "M110 145 Q115 150 120 145",
          "M175 115 Q180 120 185 115",
          "M175 130 Q180 135 185 130",
          "M175 145 Q180 150 185 145"
        ].map((d, i) => (
          <motion.path
            key={i}
            d={d}
            stroke="#6d28d9"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
          />
        ))}
      </motion.g>

      {/* Neuronas activas (partículas) */}
      {[
        { x: 120, y: 120 },
        { x: 140, y: 110 },
        { x: 160, y: 120 },
        { x: 180, y: 110 },
        { x: 130, y: 140 },
        { x: 170, y: 140 },
        { x: 125, y: 160 },
        { x: 175, y: 160 }
      ].map((pos, i) => (
        <motion.g key={i}>
          {/* Glow */}
          <motion.circle
            cx={pos.x}
            cy={pos.y}
            r="8"
            fill="#fbbf24"
            opacity="0.3"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              delay: i * 0.2 
            }}
          />
          {/* Neurona */}
          <motion.circle
            cx={pos.x}
            cy={pos.y}
            r="4"
            fill="url(#neuronGrad)"
            initial={{ scale: 0 }}
            animate={{ 
              scale: [0, 1, 0.8, 1],
            }}
            transition={{ 
              duration: 1, 
              repeat: Infinity,
              delay: i * 0.2,
              repeatDelay: 2
            }}
          />
        </motion.g>
      ))}

      {/* Conexiones sinápticas */}
      {[
        { x1: 120, y1: 120, x2: 140, y2: 110 },
        { x1: 140, y1: 110, x2: 160, y2: 120 },
        { x1: 160, y1: 120, x2: 180, y2: 110 },
        { x1: 130, y1: 140, x2: 170, y2: 140 }
      ].map((line, i) => (
        <motion.line
          key={i}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="url(#neuronGrad)"
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: [0, 1, 0],
            opacity: [0, 0.8, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            delay: i * 0.3 
          }}
        />
      ))}

      {/* Brazo izquierdo con pesa */}
      <motion.g
        animate={{ 
          rotate: [-15, 15, -15],
          x: [0, -5, 0]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: '130px 180px' }}
      >
        {/* Brazo */}
        <motion.path
          d="M130 180 Q110 200 90 220"
          stroke="#8b5cf6"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Mano */}
        <motion.circle
          cx="90"
          cy="220"
          r="8"
          fill="#a855f7"
        />

        {/* Pesa */}
        <motion.g>
          {/* Barra */}
          <rect x="70" y="218" width="40" height="4" fill="#cbd5e1" rx="2" />
          
          {/* Disco izquierdo */}
          <rect x="60" y="210" width="15" height="20" fill="url(#weightGrad)" rx="2" />
          <rect x="62" y="212" width="11" height="16" fill="#1e40af" rx="1" />
          
          {/* Disco derecho */}
          <rect x="105" y="210" width="15" height="20" fill="url(#weightGrad)" rx="2" />
          <rect x="107" y="212" width="11" height="16" fill="#1e40af" rx="1" />
        </motion.g>
      </motion.g>

      {/* Brazo derecho con pesa */}
      <motion.g
        animate={{ 
          rotate: [15, -15, 15],
          x: [0, 5, 0]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: '170px 180px' }}
      >
        {/* Brazo */}
        <motion.path
          d="M170 180 Q190 200 210 220"
          stroke="#8b5cf6"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Mano */}
        <motion.circle
          cx="210"
          cy="220"
          r="8"
          fill="#a855f7"
        />

        {/* Pesa */}
        <motion.g>
          {/* Barra */}
          <rect x="190" y="218" width="40" height="4" fill="#cbd5e1" rx="2" />
          
          {/* Disco izquierdo */}
          <rect x="180" y="210" width="15" height="20" fill="url(#weightGrad)" rx="2" />
          <rect x="182" y="212" width="11" height="16" fill="#1e40af" rx="1" />
          
          {/* Disco derecho */}
          <rect x="225" y="210" width="15" height="20" fill="url(#weightGrad)" rx="2" />
          <rect x="227" y="212" width="11" height="16" fill="#1e40af" rx="1" />
        </motion.g>
      </motion.g>

      {/* Gotas de sudor */}
      {[
        { x: 110, y: 95, delay: 0 },
        { x: 190, y: 95, delay: 0.5 },
        { x: 150, y: 90, delay: 1 }
      ].map((drop, i) => (
        <motion.g key={i}>
          <motion.path
            d={`M${drop.x} ${drop.y} Q${drop.x - 2} ${drop.y + 5} ${drop.x} ${drop.y + 8} Q${drop.x + 2} ${drop.y + 5} ${drop.x} ${drop.y}`}
            fill="#60a5fa"
            initial={{ y: 0, opacity: 1 }}
            animate={{ 
              y: [0, 20],
              opacity: [1, 0]
            }}
            transition={{ 
              duration: 1, 
              repeat: Infinity,
              delay: drop.delay,
              repeatDelay: 2
            }}
          />
        </motion.g>
      ))}

      {/* Sparkles de energía */}
      {[
        { x: 100, y: 100, delay: 0 },
        { x: 200, y: 100, delay: 0.3 },
        { x: 130, y: 80, delay: 0.6 },
        { x: 170, y: 80, delay: 0.9 },
        { x: 150, y: 200, delay: 1.2 }
      ].map((sparkle, i) => (
        <motion.g
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.2, 0],
            opacity: [0, 1, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 1.5,
            delay: sparkle.delay,
            repeat: Infinity,
            repeatDelay: 1.5
          }}
        >
          <path
            d={`M${sparkle.x} ${sparkle.y - 6}L${sparkle.x} ${sparkle.y + 6}M${sparkle.x - 6} ${sparkle.y}L${sparkle.x + 6} ${sparkle.y}M${sparkle.x - 4} ${sparkle.y - 4}L${sparkle.x + 4} ${sparkle.y + 4}M${sparkle.x - 4} ${sparkle.y + 4}L${sparkle.x + 4} ${sparkle.y - 4}`}
            stroke="#fbbf24"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </motion.g>
      ))}

      {/* Texto motivacional */}
      <motion.text
        x="150"
        y="260"
        textAnchor="middle"
        fontSize="18"
        fontWeight="900"
        fill="url(#brainGrad)"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        ¡ENTRENA TU MENTE!
      </motion.text>

      {/* Iconos de habilidades flotantes */}
      {[
        { emoji: '⚡', x: 60, y: 150, label: 'Velocidad' },
        { emoji: '🎯', x: 240, y: 150, label: 'Atención' },
        { emoji: '💾', x: 150, y: 60, label: 'Memoria' }
      ].map((skill, i) => (
        <motion.g
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            y: [0, -8, 0]
          }}
          transition={{
            scale: { delay: 1.5 + i * 0.2, duration: 0.5 },
            opacity: { delay: 1.5 + i * 0.2, duration: 0.5 },
            y: { duration: 2, repeat: Infinity, delay: i * 0.3 }
          }}
        >
          <circle cx={skill.x} cy={skill.y} r="20" fill="#1e293b" opacity="0.8" />
          <text x={skill.x} y={skill.y + 8} textAnchor="middle" fontSize="24">
            {skill.emoji}
          </text>
        </motion.g>
      ))}
    </svg>
  );
};

export default GymBrainIllustration;
