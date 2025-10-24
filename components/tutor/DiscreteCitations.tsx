import React from 'react';
import type { Chunk } from '../../types';

interface DiscreteCitationsProps {
  citations: Chunk[];
}

const DiscreteCitations: React.FC<DiscreteCitationsProps> = ({ citations }) => {
  if (!citations || citations.length === 0) {
    return null;
  }

  // Create a unique list of document titles to reference
  const uniqueDocuments = Array.from(new Set(citations.map(c => c.documentTitle)));

  return (
    <div className="ta-discrete-citations">
      <span className="text-xs text-muted">
        Basado en material oficial{' '}
        {uniqueDocuments.map((docTitle, index) => (
          <span
            key={docTitle}
            className="ta-citation-ref"
            title={docTitle}
          >
            [{index + 1}]
          </span>
        ))}
      </span>
      <style>{`
        .ta-discrete-citations {
          padding-top: 1rem;
          margin-top: 1rem;
          border-top: 1px solid var(--border);
          text-align: center;
        }
        .ta-citation-ref {
          cursor: help;
          font-weight: bold;
          color: var(--text-secondary);
          margin: 0 2px;
        }
      `}</style>
    </div>
  );
};

export default DiscreteCitations;