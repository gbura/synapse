import type { KnowledgeGraph } from '../types/knowledge';

export const knowledgeGraph: KnowledgeGraph = {
    nodes: [
        {
            id: 'mathematics',
            label: 'Mathematics',
            description: 'The study of quantities, structures, patterns and relationships.',
            category: 'mathematics',
            importance: 1,
        },
        {
            id: 'linear-algebra',
            label: 'Linear Algebra',
            description: 'The study of vectors, matrices and linear transformations.',
            category: 'mathematics',
            importance: 0.8,
        },
        {
            id: 'physics',
            label: 'Physics',
            description: 'The study of matter, energy and their interactions.',
            category: 'physics',
            importance: 0.95,
        },
        {
            id: 'biology',
            label: 'Biology',
            description: 'The study of living organisms and biological systems.',
            category: 'biology',
            importance: 0.9,
        },
        {
            id: 'neuroscience',
            label: 'Neuroscience',
            description: 'The study of the nervous system and its functions.',
            category: 'biology',
            importance: 0.8,
        },
        {
            id: 'computer-science',
            label: 'Computer Science',
            description: 'The study of computation, algorithms and information systems.',
            category: 'technology',
            importance: 0.95,
        },
        {
            id: 'artificial-intelligence',
            label: 'Artificial Intelligence',
            description: 'The study and development of computational systems capable of intelligent behavior.',
            category: 'technology',
            importance: 0.9,
        },
        {
            id: 'neural-networks',
            label: 'Neural Networks',
            description: 'Computational models inspired by interconnected biological neurons.',
            category: 'technology',
            importance: 0.85,
        },
        {
            id: 'philosophy',
            label: 'Philosophy',
            description: 'The study of fundamental questions about knowledge, existence and reason.',
            category: 'philosophy',
            importance: 0.9,
        },
    ],

    edges: [
        {
            source: 'linear-algebra',
            target: 'mathematics',
            relation: 'part-of',
            weight: 1,
        },
        {
            source: 'physics',
            target: 'mathematics',
            relation: 'depends-on',
            weight: 0.95,
        },
        {
            source: 'neuroscience',
            target: 'biology',
            relation: 'part-of',
            weight: 0.9,
        },
        {
            source: 'artificial-intelligence',
            target: 'computer-science',
            relation: 'part-of',
            weight: 0.95,
        },
        {
            source: 'neural-networks',
            target: 'artificial-intelligence',
            relation: 'part-of',
            weight: 0.9,
        },
        {
            source: 'neural-networks',
            target: 'linear-algebra',
            relation: 'depends-on',
            weight: 0.95,
        },
        {
            source: 'neuroscience',
            target: 'neural-networks',
            relation: 'influences',
            weight: 0.8,
        },
        {
            source: 'computer-science',
            target: 'mathematics',
            relation: 'depends-on',
            weight: 0.9,
        },
        {
            source: 'philosophy',
            target: 'artificial-intelligence',
            relation: 'related-to',
            weight: 0.6,
        },
        {
            source: 'biology',
            target: 'physics',
            relation: 'related-to',
            weight: 0.65,
        },
    ],
};
