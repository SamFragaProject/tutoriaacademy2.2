import React from 'react';
import { motion } from 'framer-motion';

interface BookIllustrationProps {
  className?: string;
}

const BookIllustration: React.FC<BookIllustrationProps> = ({ className = 'w-64 h-64' }) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Floating elements background */}
      {[
        { path: 'M20 40L30 50L20 60L10 50Z', delay: 0, color: '#a855f7' },
        { path: 'M170 50L180 60L170 70L160 60Z', delay: 0.3, color: '#3b82f6' },
        { path: 'M30 140L40 150L30 160L20 150Z', delay: 0.6, color: '#06b6d4' },
      ].map((shape, i) => (
        <motion.path
          key={i}
          d={shape.path}
          fill={shape.color}
          opacity="0.3"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ 
            duration: 3, 
            delay: shape.delay, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Book */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Book cover - left side */}
        <motion.path
          d="M50 60L50 160L95 150L95 50L50 60Z"
          fill="url(#bookCoverLeft)"
          stroke="#7c3aed"
          strokeWidth="2"
          animate={{ 
            rotateY: [0, -5, 0]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Book pages - middle */}
        {[0, 1, 2, 3].map((i) => (
          <motion.path
            key={i}
            d={`M${95 + i} ${50 + i}L${95 + i} ${150 + i}L${105 - i} ${150 + i}L${105 - i} ${50 + i}Z`}
            fill="#f9fafb"
            stroke="#e5e7eb"
            strokeWidth="1"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
          />
        ))}

        {/* Book cover - right side */}
        <motion.path
          d="M105 50L105 150L150 160L150 60L105 50Z"
          fill="url(#bookCoverRight)"
          stroke="#2563eb"
          strokeWidth="2"
        />

        {/* Book spine */}
        <motion.rect
          x="95"
          y="50"
          width="10"
          height="100"
          fill="url(#bookSpine)"
          stroke="#1e40af"
          strokeWidth="1"
        />
      </motion.g>

      {/* Floating icons around book */}
      {[
        { x: 60, y: 30, icon: '📚', delay: 1.2 },
        { x: 140, y: 35, icon: '✏️', delay: 1.4 },
        { x: 55, y: 170, icon: '🎓', delay: 1.6 },
        { x: 145, y: 175, icon: '💡', delay: 1.8 },
      ].map((item, i) => (
        <motion.text
          key={i}
          x={item.x}
          y={item.y}
          fontSize="24"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            y: [0, -8, 0]
          }}
          transition={{
            scale: { duration: 0.5, delay: item.delay },
            opacity: { duration: 0.5, delay: item.delay },
            y: { duration: 2, delay: item.delay, repeat: Infinity }
          }}
        >
          {item.icon}
        </motion.text>
      ))}

      {/* Sparkles */}
      {[
        { x: 70, y: 45, delay: 2 },
        { x: 130, y: 50, delay: 2.3 },
        { x: 65, y: 155, delay: 2.6 },
        { x: 135, y: 160, delay: 2.9 },
      ].map((sparkle, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 0], 
            scale: [0, 1.2, 0]
          }}
          transition={{
            duration: 1.5,
            delay: sparkle.delay,
            repeat: Infinity,
            repeatDelay: 2
          }}
        >
          <path
            d={`M${sparkle.x} ${sparkle.y - 4}L${sparkle.x} ${sparkle.y + 4}M${sparkle.x - 4} ${sparkle.y}L${sparkle.x + 4} ${sparkle.y}`}
            stroke="#fbbf24"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </motion.g>
      ))}

      {/* Page turn animation */}
      <motion.path
        d="M105 50L115 55L115 145L105 150Z"
        fill="url(#pageTurn)"
        animate={{ 
          scaleX: [1, 0.95, 1],
          x: [0, -2, 0]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Gradients */}
      <defs>
        <linearGradient id="bookCoverLeft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        
        <linearGradient id="bookCoverRight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        
        <linearGradient id="bookSpine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        
        <linearGradient id="pageTurn" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f9fafb" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#e5e7eb" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#d1d5db" stopOpacity="0.8" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default BookIllustration;
