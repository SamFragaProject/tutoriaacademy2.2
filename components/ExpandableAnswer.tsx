import React, { useState, useMemo } from 'react';

interface ExpandableAnswerProps {
  children: React.ReactNode;
  fullText: string;
  maxChars?: number;
}

const ExpandableAnswer: React.FC<ExpandableAnswerProps> = ({ children, fullText, maxChars = 400 }) => {
  const isLong = useMemo(() => fullText.length > maxChars, [fullText, maxChars]);
  const [isExpanded, setIsExpanded] = useState(!isLong);

  if (!isLong) {
    return <>{children}</>;
  }

  return (
    <div>
      {isExpanded ? children : 
        <div className="prose prose-invert text-text-primary">
          <p>{`${fullText.slice(0, maxChars)}...`}</p>
        </div>
      }
      <button onClick={() => setIsExpanded(!isExpanded)} className="ta-expand-btn">
        {isExpanded ? 'Mostrar menos' : 'Ampliar explicación'}
      </button>
      <style>{`
        .ta-expand-btn {
          display: block;
          margin-top: 12px;
          background: none;
          border: none;
          color: var(--cyan);
          font-weight: 600;
          cursor: pointer;
          padding: 4px 0;
        }
        .ta-expand-btn:hover {
          text-decoration: underline;
        }
        .ta-expand-btn:focus-visible {
          outline: 2px solid var(--cyan);
          outline-offset: 2px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default ExpandableAnswer;
