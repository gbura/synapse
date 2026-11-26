export type KnowledgeCategory = 'mathematics' | 'physics' | 'biology' | 'technology' | 'philosophy';

export type KnowledgeRelation = 'related-to' | 'depends-on' | 'part-of' | 'influences';

export interface KnowledgeNode {
    id: string;
    label: string;
    description: string;
    category: KnowledgeCategory;
    importance: number;
}

export interface KnowledgeEdge {
    source: string;
    target: string;
    relation: KnowledgeRelation;
    weight: number;
}

export interface KnowledgeGraph {
    nodes: KnowledgeNode[];
    edges: KnowledgeEdge[];
}
