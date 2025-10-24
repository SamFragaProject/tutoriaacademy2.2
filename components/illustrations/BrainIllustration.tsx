import React from 'react';
import { motion } from 'framer-motion';

interface BrainIllustrationProps {
  className?: string;
}

const BrainIllustration: React.FC<BrainIllustrationProps> = ({ className = 'w-64 h-64' }) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background glow */}
      <motion.circle
        cx="100"
        cy="100"
        r="80"
        fill="url(#brainGlow)"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Brain outline */}
      <motion.path
        d="M100 40C75 40 55 55 50 75C45 70 35 68 30 75C25 82 30 95 35 100C30 105 25 118 30 125C35 132 45 130 50 125C55 145 75 160 100 160C125 160 145 145 150 125C155 130 165 132 170 125C175 118 170 105 165 100C170 95 175 82 170 75C165 68 155 70 150 75C145 55 125 40 100 40Z"
        fill="url(#brainGradient)"
        stroke="url(#brainStroke)"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2 }}
      />

      {/* Neural connections */}
      {[
        { x1: 70, y1: 70, x2: 90, y2: 85 },
        { x1: 130, y1: 70, x2: 110, y2: 85 },
        { x1: 70, y1: 130, x2: 90, y2: 115 },
        { x1: 130, y1: 130, x2: 110, y2: 115 },
      ].map((line, i) => (
        <motion.line
          key={i}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="url(#connectionGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 1 + i * 0.2 }}
        />
      ))}

      {/* Neural nodes */}
      {[
        { cx: 70, cy: 70 },
        { cx: 130, cy: 70 },
        { cx: 100, cy: 100 },
        { cx: 70, cy: 130 },
        { cx: 130, cy: 130 },
      ].map((node, i) => (
        <motion.circle
          key={i}
          cx={node.cx}
          cy={node.cy}
          r="6"
          fill="url(#nodeGradient)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 1.5 + i * 0.1 }}
        >
          <animate
            attributeName="r"
            values="6;8;6"
            dur="2s"
            begin={`${i * 0.3}s`}
            repeatCount="indefinite"
          />
        </motion.circle>
      ))}

      {/* Sparkles */}
      {[
        { x: 60, y: 50, delay: 0 },
        { x: 140, y: 60, delay: 0.5 },
        { x: 50, y: 110, delay: 1 },
        { x: 150, y: 120, delay: 1.5 },
      ].map((sparkle, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{
            duration: 2,
            delay: sparkle.delay,
            repeat: Infinity,
            repeatDelay: 2
          }}
        >
          <path
            d={`M${sparkle.x} ${sparkle.y - 5}L${sparkle.x} ${sparkle.y + 5}M${sparkle.x - 5} ${sparkle.y}L${sparkle.x + 5} ${sparkle.y}`}
            stroke="#fbbf24"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </motion.g>
      ))}

      {/* Gradients */}
      <defs>
        <radialGradient id="brainGlow">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </radialGradient>
        
        <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        
        <linearGradient id="brainStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        
        <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        
        <radialGradient id="nodeGradient">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default BrainIllustration;
