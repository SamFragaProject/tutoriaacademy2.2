import React from 'react';
import { FileText } from 'lucide-react';

const SourcesPlaceholder: React.FC = () => {
  return (
    <details className="mt-4 bg-surface-2/50 border border-border rounded-lg">
      <summary className="p-3 font-semibold text-sm text-text-secondary cursor-pointer flex items-center gap-2">
        <FileText size={16} />
        Fuentes disponibles al activar RAG
      </summary>
      <div className="p-3 border-t border-border text-xs text-muted">
        <p>Esta sección mostrará las fuentes de los documentos oficiales (PDFs, guías) que el tutor utiliza para generar las respuestas. Esta función requiere la integración de Retrieval-Augmented Generation (RAG).</p>
      </div>
    </details>
  );
};

export default SourcesPlaceholder;
