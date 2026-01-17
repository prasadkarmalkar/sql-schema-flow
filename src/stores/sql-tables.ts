import { addEdge, applyEdgeChanges, applyNodeChanges, type Edge, type Node, type OnConnect, type OnNodesChange, type OnEdgesChange } from '@xyflow/react';
import { create } from 'zustand';

export type Column = {
  id: string;
  name: string;
  dataType: string;
  size?: string;
};

type SQLTablesStoreType = {
    nodes: Node[];
    edges: Edge[];
    addTable: (table: Node) => void;
    addEdge: (edge: Edge) => void;
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    addColumn: (tableId: string) => void;
    removeTable: (tableId: string) => void;
    removeColumn: (tableId: string, columnId: string) => void;
    updateColumn: (tableId: string, columnId: string, field: keyof Column, value: string) => void;
    getTableColumns: (tableId: string) => Column[];
    updateTableName: (tableId: string, name: string) => void;
}

export const useSQLTables = create<SQLTablesStoreType>((set, get) => ({
    nodes: [],
    edges: [],
    addTable: (table: Node) => set((state) => ({ nodes: [...state.nodes, table] })),
    removeTable: (tableId: string) => set((state) => ({ nodes: state.nodes.filter(node => node.id !== tableId) })),
    addEdge: (edge: Edge) => set((state) => ({ edges: [...state.edges, edge] })),
    onNodesChange: (changes) => set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) })),
    onEdgesChange: (changes) => set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),
    onConnect: (connection) => set((state) => ({ edges: addEdge(connection, state.edges) })),
    
    addColumn: (tableId: string) => set((state) => ({
      nodes: state.nodes.map(node => {
        if (node.id === tableId) {
          const currentColumns = node.data.columns || [];
          const newColumn: Column = {
            id: Date.now().toString(),
            name: '',
            dataType: '',
            size: ''
          };
          return {
            ...node,
            data: {
              ...node.data,
              columns: [...currentColumns, newColumn]
            }
          };
        }
        return node;
      })
    })),
    
    removeColumn: (tableId: string, columnId: string) => set((state) => ({
      nodes: state.nodes.map(node => {
        if (node.id === tableId) {
          const currentColumns = node.data.columns || [];
          return {
            ...node,
            data: {
              ...node.data,
              columns: currentColumns.filter((col: Column) => col.id !== columnId)
            }
          };
        }
        return node;
      })
    })),
    
    updateColumn: (tableId: string, columnId: string, field: keyof Column, value: string) => set((state) => ({
      nodes: state.nodes.map(node => {
        if (node.id === tableId) {
          const currentColumns = node.data.columns || [];
          return {
            ...node,
            data: {
              ...node.data,
              columns: currentColumns.map((col: Column) => 
                col.id === columnId ? { ...col, [field]: value } : col
              )
            }
          };
        }
        return node;
      })
    })),
    
    getTableColumns: (tableId: string) => {
      const node = get().nodes.find(n => n.id === tableId);
      return node?.data.columns || [];
    },
    
    updateTableName: (tableId: string, name: string) => set((state) => ({
      nodes: state.nodes.map(node => {
        if (node.id === tableId) {
          return {
            ...node,
            data: {
              ...node.data,
              label: name
            }
          };
        }
        return node;
      })
    }))
}));