import React from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface ControlPanelCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  link: string;
  color: 'cyan' | 'purple' | 'accent';
}

const ControlPanelCard: React.FC<ControlPanelCardProps> = ({ icon: Icon, title, description, link, color }) => {
  const colorClasses = {
    cyan: 'border-info text-info',
    purple: 'border-primary text-primary',
    accent: 'border-accent-b text-accent-b',
  };

  return (
    <NavLink 
      to={link} 
      className={`group flex flex-col gap-4 p-6 bg-surface-1 border border-border rounded-card transition-all duration-fast ease-out hover:-translate-y-1 hover:shadow-card-hover border-l-4 ${colorClasses[color].split(' ')[0]}`}
    >
      <div className="flex items-center gap-4">
        <Icon className={`h-8 w-8 ${colorClasses[color].split(' ')[1]}`} />
        <h3 className="text-xl font-bold text-text-primary">{title}</h3>
      </div>
      <p className="text-sm text-text-secondary flex-grow">{description}</p>
      <div className="flex justify-between items-center font-semibold text-text-secondary group-hover:text-text-primary">
        <span>Gestionar</span>
        <ArrowRight size={16} />
      </div>
    </NavLink>
  );
};
export default ControlPanelCard;