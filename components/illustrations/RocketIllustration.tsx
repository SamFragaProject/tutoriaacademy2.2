import React from 'react';
import { motion } from 'framer-motion';

interface RocketIllustrationProps {
  className?: string;
}

const RocketIllustration: React.FC<RocketIllustrationProps> = ({ className = 'w-64 h-64' }) => {
  return (
    <svg 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background stars */}
      {[
        { cx: 30, cy: 40, delay: 0 },
        { cx: 160, cy: 50, delay: 0.3 },
        { cx: 50, cy: 150, delay: 0.6 },
        { cx: 170, cy: 130, delay: 0.9 },
      ].map((star, i) => (
        <motion.circle
          key={i}
          cx={star.cx}
          cy={star.cy}
          r="2"
          fill="#fbbf24"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, delay: star.delay, repeat: Infinity }}
        />
      ))}

      {/* Rocket body */}
      <motion.g
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Rocket main body */}
        <motion.path
          d="M100 30L110 60L110 120L100 130L90 120L90 60L100 30Z"
          fill="url(#rocketBody)"
          stroke="url(#rocketStroke)"
          strokeWidth="2"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Rocket nose cone */}
        <motion.path
          d="M100 10L115 50L85 50L100 10Z"
          fill="url(#rocketNose)"
          stroke="url(#rocketStroke)"
          strokeWidth="2"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        />

        {/* Window */}
        <motion.circle
          cx="100"
          cy="80"
          r="12"
          fill="url(#windowGradient)"
          stroke="#1e40af"
          strokeWidth="2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        />

        {/* Window reflection */}
        <motion.ellipse
          cx="97"
          cy="77"
          rx="4"
          ry="6"
          fill="#ffffff"
          opacity="0.6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
        />

        {/* Left wing */}
        <motion.path
          d="M90 100L70 130L75 135L90 120L90 100Z"
          fill="url(#wingGradient)"
          stroke="url(#rocketStroke)"
          strokeWidth="2"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />

        {/* Right wing */}
        <motion.path
          d="M110 100L130 130L125 135L110 120L110 100Z"
          fill="url(#wingGradient)"
          stroke="url(#rocketStroke)"
          strokeWidth="2"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
      </motion.g>

      {/* Flames */}
      <motion.g
        animate={{ 
          scaleY: [1, 1.3, 1],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        {/* Center flame */}
        <motion.path
          d="M95 130L100 160L105 130Z"
          fill="url(#flameGradient1)"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        />
        
        {/* Left flame */}
        <motion.path
          d="M85 130L90 155L95 130Z"
          fill="url(#flameGradient2)"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.5, delay: 1.3 }}
        />
        
        {/* Right flame */}
        <motion.path
          d="M105 130L110 155L115 130Z"
          fill="url(#flameGradient2)"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.5, delay: 1.3 }}
        />
      </motion.g>

      {/* Smoke particles */}
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          cx="100"
          cy="165"
          r="8"
          fill="url(#smokeGradient)"
          animate={{
            y: [0, -50],
            x: [0, (i - 1) * 20],
            opacity: [0.6, 0],
            scale: [1, 1.5]
          }}
          transition={{
            duration: 2,
            delay: i * 0.5,
            repeat: Infinity
          }}
        />
      ))}

      {/* Gradients */}
      <defs>
        <linearGradient id="rocketBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f3f4f6" />
          <stop offset="100%" stopColor="#d1d5db" />
        </linearGradient>
        
        <linearGradient id="rocketNose" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
        
        <linearGradient id="rocketStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6b7280" />
          <stop offset="100%" stopColor="#4b5563" />
        </linearGradient>
        
        <linearGradient id="windowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        
        <linearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        
        <linearGradient id="flameGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="50%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
        
        <linearGradient id="flameGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        
        <radialGradient id="smokeGradient">
          <stop offset="0%" stopColor="#9ca3af" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#6b7280" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default RocketIllustration;
