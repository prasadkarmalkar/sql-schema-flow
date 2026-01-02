import type { Edge, Node } from '@xyflow/react';
import { create } from 'zustand';

type SQLTablesStoreType = {
    nodes: Node[];
    edges: Edge[];
    addTable: (table: Node) => void;
    addEdge: (edge: Edge) => void;
}

export const useSQLTables = create<SQLTablesStoreType>((set) => ({
    nodes: [],
    edges: [],
    addTable: (table: Node) => set((state) => ({ nodes: [...state.nodes, table] })),
    addEdge: (edge: Edge) => set((state) => ({ edges: [...state.edges, edge] })),
}));