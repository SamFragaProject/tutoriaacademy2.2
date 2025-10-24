import React from 'react';
import { ChevronDown } from 'lucide-react';

interface AreaSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const AreaSelector: React.FC<AreaSelectorProps> = ({ value, onChange, disabled }) => (
  <div className="ta-area-selector-wrapper">
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="ta-area-selector"
      disabled={disabled}
    >
      <option value="General">Área: General</option>
      <option value="Matemáticas">Matemáticas</option>
      <option value="Comprensión Lectora">Comprensión Lectora</option>
    </select>
    <ChevronDown className="ta-area-selector-icon" />
    <style>{`
      .ta-area-selector-wrapper {
        position: relative;
        display: inline-block;
      }
      .ta-area-selector {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-color: var(--surface-1);
        border: 1px solid var(--border);
        border-radius: var(--radius-button);
        padding: 8px 32px 8px 16px;
        color: var(--text-primary);
        font-weight: 500;
        cursor: pointer;
        transition: border-color 0.2s;
      }
      .ta-area-selector:hover:not(:disabled) {
        border-color: var(--primary);
      }
      .ta-area-selector:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 2px var(--background), 0 0 0 4px var(--primary);
      }
      .ta-area-selector:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .ta-area-selector-icon {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
        color: var(--text-secondary);
        width: 16px;
        height: 16px;
      }
    `}</style>
  </div>
);

export default AreaSelector;