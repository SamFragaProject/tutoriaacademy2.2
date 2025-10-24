import React from 'react';

const icons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  Compass: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  ),
  Atom: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="1" />
        <path d="M20.2 20.2c2.04-2.03.02-5.91-2.98-8.9-3-3-6.87-4.99-8.9-2.98" />
        <path d="M3.8 3.8c-2.04 2.03-.02 5.91 2.98 8.9 3 3 6.87 4.99 8.9 2.98" />
        <path d="M20.2 3.8c-2.03 2.04-5.91.02-8.9-2.98-3-3-4.99-6.87-2.98-8.9" />
        <path d="M3.8 20.2c2.03-2.04 5.91-.02 8.9 2.98 3 3 4.99 6.87 2.98 8.9" />
    </svg>
  ),
  BrainCircuit: (props) => (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 5a3 3 0 1 0-5.993.129" />
        <path d="M12 5a3 3 0 1 0 5.993.129" />
        <path d="M15 13a3 3 0 1 0-5.993.129" /><path d="M15 13a3 3 0 1 0 5.993.129" />
        <path d="M9 13a3 3 0 1 0-5.993.129" />
        <path d="M6.007 8.129A3 3 0 1 0 9 13" />
        <path d="M17.993 8.129A3 3 0 1 0 15 13" />
        <path d="M12 18a3 3 0 1 0-5.993.129" /><path d="M12 18a3 3 0 1 0 5.993.129" />
        <path d="M12 13h.01" /><path d="M12 8h.01" />
        <path d="M9 8h.01" /><path d="M15 8h.01" />
        <path d="M9 18h.01" /><path d="M15 18h.01" />
    </svg>
  ),
  Sigma: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 7V4H6v3" />
      <path d="M12 4v16" />
      <path d="M18 17v3H6v-3" />
    </svg>
  ),
  Feather: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
      <path d="m16 8-4 4" /><path d="m20 12-4 4" />
    </svg>
  ),
  BookOpen: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  Infinity: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z" />
    </svg>
  ),
  Award: (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  ),
};

export const TaIcon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  const IconComponent = icons[name];
  return IconComponent ? <IconComponent className={className} /> : null;
};
