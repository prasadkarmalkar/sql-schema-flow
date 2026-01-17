import { addEdge, applyEdgeChanges, applyNodeChanges, type Edge, type Node, type OnConnect, type OnNodesChange, type OnEdgesChange } from '@xyflow/react';
import { create } from 'zustand';

type SQLTablesStoreType = {
    nodes: Node[];
    edges: Edge[];
    addTable: (table: Node) => void;
    addEdge: (edge: Edge) => void;
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
}

export const useSQLTables = create<SQLTablesStoreType>((set) => ({
    nodes: [],
    edges: [],
    addTable: (table: Node) => set((state) => ({ nodes: [...state.nodes, table] })),
    addEdge: (edge: Edge) => set((state) => ({ edges: [...state.edges, edge] })),
    onNodesChange: (changes) => set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) })),
    onEdgesChange: (changes) => set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),
    onConnect: (connection) => set((state) => ({ edges: addEdge(connection, state.edges) })),
}));