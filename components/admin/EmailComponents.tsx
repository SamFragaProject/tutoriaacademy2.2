import React from 'react';

interface EmailPreviewProps {
  subject: string;
  preheader: string;
  bodyHtml: string;
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({ subject, preheader, bodyHtml }) => {
  return (
    <div className="ta-email-preview-container">
      <div className="ta-email-preview-header">
        <p><strong>Asunto:</strong> {subject}</p>
        <p><strong>Preheader:</strong> {preheader}</p>
      </div>
      <div className="ta-email-preview-body" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      <style>{`
        .ta-email-preview-container { 
            border: 1px solid var(--color-border); 
            border-radius: var(--radius-card);
            background-color: var(--color-background);
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        .ta-email-preview-header {
            padding: 1rem;
            border-bottom: 1px solid var(--color-border);
            font-size: 0.875rem;
            color: var(--color-text-secondary);
        }
        .ta-email-preview-header p { margin: 0; }
        .ta-email-preview-body {
            padding: 1.5rem;
            flex-grow: 1;
            overflow-y: auto;
        }
      `}</style>
    </div>
  );
};

interface VariableReferenceProps {
    templateId: string;
}

export const VariableReference: React.FC<VariableReferenceProps> = ({ templateId }) => {
    const commonVars = ['{{nombre}}'];
    const weeklyVars = ['{{racha}}', '{{xp}}', '{{score}}', '{{area}}', '{{temasDebiles}}'];
    const vars = templateId === 'weekly' ? [...commonVars, ...weeklyVars] : commonVars;

    return (
        <div className="ta-variable-ref">
            <h4 className="ta-variable-ref-title">Variables Disponibles</h4>
            <div className="ta-variable-ref-tags">
                {vars.map(v => <code key={v}>{v}</code>)}
            </div>
            <style>{`
                .ta-variable-ref { margin-top: 1rem; }
                .ta-variable-ref-title { font-size: 0.8rem; color: var(--color-text-secondary); margin-bottom: 0.5rem; }
                .ta-variable-ref-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
                .ta-variable-ref-tags code {
                    background-color: var(--color-surface-2);
                    border: 1px solid var(--color-border);
                    padding: 0.25rem 0.5rem;
                    border-radius: var(--radius-button);
                    font-size: 0.75rem;
                    color: var(--color-info);
                }
            `}</style>
        </div>
    );
};