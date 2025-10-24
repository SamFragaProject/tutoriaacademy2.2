import React, { useMemo } from 'react';
import { Link } from 'lucide-react';

interface CitationListProps {
  content: string;
}

const CitationList: React.FC<CitationListProps> = ({ content }) => {
  const citations = useMemo(() => {
    return content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('•') || line.startsWith('-'));
  }, [content]);

  if (citations.length === 0) {
    return null;
  }

  return (
    <div className="ta-citation-list">
      <h4 className="ta-citation-title">Fuentes y Citas</h4>
      <ul>
        {citations.map((citation, index) => (
          <li key={index}>
            <Link size={14} className="ta-citation-icon"/>
            {citation.substring(1).trim()}
          </li>
        ))}
      </ul>
      <style>{`
        .ta-citation-list {
          margin-top: 20px;
          padding: 16px;
          border-radius: var(--radius);
          background-color: rgba(0, 0, 0, 0.2);
          border: 1px solid var(--border);
        }
        .ta-citation-title {
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 12px;
        }
        .ta-citation-list ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .ta-citation-list li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
        .ta-citation-icon {
          flex-shrink: 0;
          margin-top: 3px;
          color: var(--purple);
        }
      `}</style>
    </div>
  );
};

export default CitationList;
