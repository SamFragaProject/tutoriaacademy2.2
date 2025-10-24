import React, { useEffect, useRef } from 'react';

declare global {
    interface Window {
        katex: any;
        marked: { parse: (md: string) => string };
        DOMPurify: { sanitize: (html: string, options?: object) => string };
    }
}

interface MathMarkdownProps {
  content: string;
}

const MathMarkdown: React.FC<MathMarkdownProps> = ({ content }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !window.katex || !window.marked || !window.DOMPurify) {
      if(container) container.textContent = content;
      return;
    }

    try {
        let processedContent = content;
        const katexExpressions: { placeholder: string, expression: string, displayMode: boolean }[] = [];
        let counter = 0;

        // Replace LaTeX with placeholders
        processedContent = processedContent.replace(/\$\$([\s\S]+?)\$\$/g, (match, expression) => {
            const placeholder = `__KATEX_PLACEHOLDER_${counter++}__`;
            katexExpressions.push({ placeholder, expression, displayMode: true });
            return placeholder;
        });
        processedContent = processedContent.replace(/\$([^\n\r$]+?)\$/g, (match, expression) => {
            const placeholder = `__KATEX_PLACEHOLDER_${counter++}__`;
            katexExpressions.push({ placeholder, expression, displayMode: false });
            return placeholder;
        });

        // Convert markdown to sanitized HTML
        const markdownHtml = window.marked.parse(processedContent);
        let sanitizedHtml = window.DOMPurify.sanitize(markdownHtml);

        // Replace placeholders with KaTeX rendered HTML
        katexExpressions.forEach(({ placeholder, expression, displayMode }) => {
            const katexHtml = window.katex.renderToString(expression.trim(), {
                displayMode,
                throwOnError: false,
                output: 'html',
            });
            // Handle block and inline replacements
            sanitizedHtml = sanitizedHtml.replace(`<p>${placeholder}</p>`, katexHtml).replace(placeholder, katexHtml);
        });

        container.innerHTML = sanitizedHtml;

    } catch (error) {
        console.error("Error processing content:", error);
        container.textContent = content; // Fallback
    }

  }, [content]);

  return <div ref={containerRef} className="prose prose-invert text-text-primary max-w-none" />;
};

export default MathMarkdown;
