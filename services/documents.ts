import type { Subject, Document, Chunk } from '../types';

const DOCS_STORAGE_KEY = 'docs:all';

const MOCK_DOCUMENTS_INITIAL: Document[] = [
  {
    id: 'doc-mate-1',
    title: 'Guía de Álgebra Esencial.pdf',
    subject: 'Matemáticas',
    topic: 'Álgebra',
    subTopics: ['Ecuaciones de primer grado', 'Factorización'],
    type: 'pdf',
    status: 'indexado',
  },
  {
    id: 'doc-mate-2',
    title: 'Apuntes de Geometría.pdf',
    subject: 'Matemáticas',
    topic: 'Geometría',
    subTopics: ['Teorema de Pitágoras'],
    type: 'pdf',
    status: 'en_cola',
  },
  {
    id: 'doc-leng-1',
    title: 'Reglas de Acentuación.txt',
    subject: 'Lengua',
    topic: 'Ortografía',
    subTopics: ['Agudas, graves y esdrújulas'],
    type: 'txt',
    status: 'indexado',
  },
];

const MOCK_CHUNKS: Chunk[] = [
  // Álgebra
  { id: 'c1', documentId: 'doc-mate-1', documentTitle: 'Guía de Álgebra Esencial', subTopic: 'Ecuaciones de primer grado', content: 'Una ecuación de primer grado es una igualdad que involucra una o más variables a la primera potencia y no contiene productos entre las variables.' },
  { id: 'c2', documentId: 'doc-mate-1', documentTitle: 'Guía de Álgebra Esencial', subTopic: 'Ecuaciones de primer grado', content: 'Para resolver una ecuación de primer grado, se deben agrupar los términos con la incógnita en un miembro y los términos independientes en el otro. Ejemplo: $$2x + 3 = 9 \\rightarrow 2x = 6 \\rightarrow x = 3$$.' },
  { id: 'c3', documentId: 'doc-mate-1', documentTitle: 'Guía de Álgebra Esencial', subTopic: 'Factorización', content: 'La factorización por diferencia de cuadrados se aplica a binomios de la forma $$a^2 - b^2$$ y su resultado es $$(a + b)(a - b)$$.' },
  // Ortografía
  { id: 'c4', documentId: 'doc-leng-1', documentTitle: 'Reglas de Acentuación', subTopic: 'Agudas, graves y esdrújulas', content: 'Las palabras agudas llevan tilde cuando terminan en n, s o vocal.' },
  { id: 'c5', documentId: 'doc-leng-1', documentTitle: 'Reglas de Acentuación', subTopic: 'Agudas, graves y esdrújulas', content: 'Las palabras graves llevan tilde cuando NO terminan en n, s o vocal. Ejemplo: árbol.' },
  { id: 'c6', documentId: 'doc-leng-1', documentTitle: 'Reglas de Acentuación', subTopic: 'Agudas, graves y esdrújulas', content: 'Todas las palabras esdrújulas y sobreesdrújulas siempre llevan tilde. Ejemplo: brújula, cómpramelo.' },
];

export const getAllDocuments = (): Document[] => {
    if (typeof window === 'undefined') return MOCK_DOCUMENTS_INITIAL;
    try {
        const stored = localStorage.getItem(DOCS_STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        } else {
            localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(MOCK_DOCUMENTS_INITIAL));
            return MOCK_DOCUMENTS_INITIAL;
        }
    } catch {
        return MOCK_DOCUMENTS_INITIAL;
    }
};

const saveAllDocuments = (docs: Document[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(DOCS_STORAGE_KEY, JSON.stringify(docs));
};

export const processDocument = async (docId: string): Promise<Document> => {
    let docs = getAllDocuments();
    const docIndex = docs.findIndex(d => d.id === docId);
    if (docIndex === -1) throw new Error("Document not found");

    docs[docIndex].status = 'procesando';
    saveAllDocuments(docs);
    
    // Simulate processing time
    await new Promise(res => setTimeout(res, 2500)); 
    
    docs = getAllDocuments(); // Re-fetch in case of concurrent changes
    const freshDocIndex = docs.findIndex(d => d.id === docId);
    docs[freshDocIndex].status = 'indexado';
    saveAllDocuments(docs);
    
    return docs[freshDocIndex];
};

export const getAvailableKnowledgeBases = (): Subject[] => {
    const docs = getAllDocuments();
    const indexedSubjects = docs
        .filter(d => d.status === 'indexado')
        .map(d => d.subject);
    return Array.from(new Set(indexedSubjects));
};

export const getDocumentStatsForTopic = (subject: Subject, topic: string) => {
    const relevantDocs = getAllDocuments().filter(d => d.subject === subject && d.topic === topic);
    return {
        count: relevantDocs.length,
        unsupported: relevantDocs.some(d => d.status !== 'indexado'),
    };
};

export const getTopicsForSubject = (subject: Subject): { topic: string, subTopics: string[] }[] => {
    const topics: Record<string, Set<string>> = {};
    getAllDocuments().forEach(doc => {
        if (doc.subject === subject) {
            if (!topics[doc.topic]) {
                topics[doc.topic] = new Set();
            }
            doc.subTopics.forEach(sub => topics[doc.topic].add(sub));
        }
    });
    return Object.entries(topics).map(([topic, subTopicsSet]) => ({
        topic,
        subTopics: Array.from(subTopicsSet),
    }));
};

export const countChunksForSubTopic = (subTopic: string): number => {
    return MOCK_CHUNKS.filter(c => c.subTopic === subTopic).length;
};

export const findChunks = (subTopic: string, count = 2): Chunk[] => {
    const relevant = MOCK_CHUNKS.filter(c => c.subTopic === subTopic);
    return relevant.sort(() => 0.5 - Math.random()).slice(0, count);
};
