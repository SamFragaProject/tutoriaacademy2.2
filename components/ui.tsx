import React, { ReactNode } from 'react';
import { Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  gradient?: string;
  animated?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', gradient, animated = true, ...props }) => {
  const CardComponent = animated ? motion.div : 'div';
  const animationProps = animated ? {
    whileHover: { y: -4, transition: { duration: 0.2 } },
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  } : {};

  return (
    <CardComponent
      {...props}
      {...(animated ? animationProps : {})}
      className={`relative rounded-2xl border border-border bg-surface-1/80 backdrop-blur-sm p-6 shadow-lg hover:shadow-xl hover:border-primary/50 transition-all duration-300 overflow-hidden ${className}`}
    >
      {gradient && (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      )}
      <div className="relative z-10">{children}</div>
    </CardComponent>
  );
};

export const Chip: React.FC<{children: React.ReactNode, color?: 'default' | 'beta' | 'primary' | 'success' | 'warning'}> = ({ children, color = 'default' }) => {
  const colorClasses = {
    default: 'bg-surface-1/80 border-border text-text-secondary hover:border-primary/50',
    beta: 'bg-green-600/20 border-green-500/30 text-green-400 hover:bg-green-600/30',
    primary: 'bg-purple-600/20 border-purple-500/30 text-purple-400 hover:bg-purple-600/30',
    success: 'bg-emerald-600/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30',
    warning: 'bg-orange-600/20 border-orange-500/30 text-orange-400 hover:bg-orange-600/30'
  };
  return (
    <motion.span 
      whileHover={{ scale: 1.05, y: -1 }}
      className={`inline-block rounded-full backdrop-blur-sm border px-4 py-1.5 text-sm font-bold transition-all duration-300 ${colorClasses[color]}`}
    >
      {children}
    </motion.span>
  );
};


interface StatCardProps {
    icon: React.ElementType;
    label: string;
    value: string | number;
    color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'cyan' | 'orange';
    trend?: number;
}

export const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, color, trend }) => {
    const colorConfig = {
        blue: { gradient: 'from-blue-500 to-blue-700', bg: 'bg-blue-500/10', text: 'text-blue-400' },
        green: { gradient: 'from-green-500 to-emerald-700', bg: 'bg-green-500/10', text: 'text-green-400' },
        red: { gradient: 'from-red-500 to-pink-700', bg: 'bg-red-500/10', text: 'text-red-400' },
        yellow: { gradient: 'from-yellow-500 to-amber-700', bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
        purple: { gradient: 'from-purple-500 to-purple-700', bg: 'bg-purple-500/10', text: 'text-purple-400' },
        cyan: { gradient: 'from-cyan-500 to-teal-700', bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
        orange: { gradient: 'from-orange-500 to-red-600', bg: 'bg-orange-500/10', text: 'text-orange-400' },
    };
    
    const config = colorConfig[color];
    
    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            className="group relative"
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300 blur-xl`} />
            <Card className="p-6 group" animated={false}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-xl bg-gradient-to-br ${config.gradient} shadow-lg`}>
                            <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-text-secondary mb-1">{label}</p>
                            <p className="text-3xl font-black text-text-primary">{value}</p>
                        </div>
                    </div>
                    {trend !== undefined && (
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${trend >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
                        </div>
                    )}
                </div>
                <div className="mt-4 h-1 bg-surface-2 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={`h-full bg-gradient-to-r ${config.gradient}`}
                    />
                </div>
            </Card>
        </motion.div>
    );
}

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  icon?: React.ElementType;
  loading?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ children, className = '', icon: Icon, loading, ...props }) => (
  <motion.button
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    className={`group relative px-8 py-3 font-bold text-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${className}`}
    {...props}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600" />
    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <span className="relative z-10 flex items-center justify-center gap-2">
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
        />
      ) : Icon ? (
        <Icon className="w-5 h-5" />
      ) : null}
      {children}
    </span>
  </motion.button>
);

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  icon?: React.ElementType;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({ children, className = '', icon: Icon, ...props }) => (
  <motion.button
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    className={`px-8 py-3 font-bold text-text-primary bg-surface-1/80 backdrop-blur-sm rounded-2xl border-2 border-border hover:border-primary transition-all duration-300 shadow-md hover:shadow-lg ${className}`}
    {...props}
  >
    <span className="flex items-center justify-center gap-2">
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </span>
  </motion.button>
);


interface ComingSoonTooltipProps {
  children: React.ReactElement<{ className?: string; disabled?: boolean; }>;
  text: string;
  explanation: string;
}

export const ComingSoonTooltip: React.FC<ComingSoonTooltipProps> = ({ children, text, explanation }) => {
  return (
    <div className="relative group">
      {React.cloneElement(children, { disabled: true, className: `${children.props.className || ''} disabled:opacity-50 disabled:cursor-not-allowed` })}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-surface-1 border border-border text-white rounded-card shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 backdrop-blur-md">
        <div className="flex items-start space-x-2">
            <Info size={18} className="text-primary mt-0.5 flex-shrink-0" />
            <div>
                <p className="font-bold text-text-primary">{text}</p>
                <p className="text-xs text-text-secondary mt-1">{explanation}</p>
            </div>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[-5px] w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-surface-1"></div>
      </div>
    </div>
  );
};

interface ComingSoonBannerProps {
  feature: string;
  explanation: string;
}

export const ComingSoonBanner: React.FC<ComingSoonBannerProps> = ({ feature, explanation }) => {
    return (
        <Card className="text-center border-primary/50 shadow-primary">
            <span className="inline-block px-3 py-1 text-sm font-semibold text-primary bg-primary/20 rounded-full mb-2">
                Próximamente
            </span>
            <h3 className="text-lg font-bold text-text-primary">{feature}</h3>
            <p className="text-sm text-text-secondary mt-1">{explanation}</p>
        </Card>
    );
};

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3 cursor-pointer">
    <span className="text-sm font-medium text-text-secondary">{label}</span>
    <div className="relative">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <div className={`block w-11 h-6 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-surface-2'}`}></div>
      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'translate-x-5' : ''}`}></div>
    </div>
  </label>
);

interface ProgressBarProps {
    progress: number;
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'purple' | 'cyan';
    className?: string;
    showLabel?: boolean;
    animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, color = 'primary', className = '', showLabel = false, animated = true }) => {
    const colorGradients = {
        primary: 'from-purple-500 to-blue-600',
        secondary: 'from-blue-500 to-cyan-600',
        success: 'from-green-500 to-emerald-600',
        warning: 'from-orange-500 to-red-600',
        purple: 'from-purple-500 to-pink-600',
        cyan: 'from-cyan-500 to-teal-600',
    };
    
    return (
        <div className={`relative w-full ${className}`}>
            <div className="w-full bg-surface-2 rounded-full h-3 border border-border overflow-hidden shadow-inner">
                <motion.div 
                    initial={animated ? { width: 0 } : { width: `${progress}%` }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${colorGradients[color]} rounded-full relative overflow-hidden`}
                >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </motion.div>
            </div>
            {showLabel && (
                <span className="absolute right-0 -top-6 text-sm font-bold text-text-primary">
                    {Math.round(progress)}%
                </span>
            )}
        </div>
    );
};