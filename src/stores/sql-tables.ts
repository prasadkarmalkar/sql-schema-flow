import { addEdge, applyEdgeChanges, applyNodeChanges, type Edge, type Node, type OnConnect, type OnNodesChange, type OnEdgesChange } from '@xyflow/react';
import { create } from 'zustand';

export type Column = {
  id: string;
  name: string;
  dataType: string;
  size?: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  isNullable?: boolean;
  isUnique?: boolean;
  isAutoIncrement?: boolean;
  defaultValue?: string;
  foreignKeyTable?: string;
  foreignKeyColumn?: string;
  description?: string;
};

type SelectedItem = {
  type: 'table' | 'column' | null;
  tableId?: string;
  columnId?: string;
};

type SQLTablesStoreType = {
    nodes: Node[];
    edges: Edge[];
    projectName: string;
    isDark: boolean;
    selectedItem: SelectedItem;
    isSQLDrawerOpen: boolean;
    generatedSQL: string;
    addTable: (table: Node) => void;
    addEdge: (edge: Edge) => void;
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
    addColumn: (tableId: string) => void;
    removeTable: (tableId: string) => void;
    removeColumn: (tableId: string, columnId: string) => void;
    updateColumn: (tableId: string, columnId: string, field: keyof Column, value: string | boolean) => void;
    getTableColumns: (tableId: string) => Column[];
    updateTableName: (tableId: string, name: string) => void;
    setProjectName: (name: string) => void;
    toggleTheme: () => void;
    setSelectedItem: (item: SelectedItem) => void;
    toggleSQLDrawer: () => void;
    setGeneratedSQL: (sql: string) => void;
    getSelectedColumn: () => Column | null;
    getSelectedTable: () => Node | null;
}

export const useSQLTables = create<SQLTablesStoreType>((set, get) => ({
    nodes: [],
    edges: [],
    projectName: 'Untitled Project',
    isDark: false,
    selectedItem: { type: null },
    isSQLDrawerOpen: false,
    generatedSQL: '',
    
    addTable: (table: Node) => set((state) => ({ nodes: [...state.nodes, table] })),
    
    removeTable: (tableId: string) => set((state) => ({ 
      nodes: state.nodes.filter(node => node.id !== tableId),
      edges: state.edges.filter(edge => edge.source !== tableId && edge.target !== tableId),
      selectedItem: state.selectedItem.tableId === tableId ? { type: null } : state.selectedItem
    })),
    
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
            size: '',
            isPrimaryKey: false,
            isForeignKey: false,
            isNullable: true,
            isUnique: false,
            isAutoIncrement: false,
            defaultValue: '',
            description: ''
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
      }),
      selectedItem: state.selectedItem.columnId === columnId ? { type: null } : state.selectedItem
    })),
    
    updateColumn: (tableId: string, columnId: string, field: keyof Column, value: string | boolean) => set((state) => ({
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
    })),
    
    setProjectName: (name: string) => set({ projectName: name }),
    
    toggleTheme: () => set((state) => {
      const newIsDark = !state.isDark;
      if (newIsDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { isDark: newIsDark };
    }),
    
    setSelectedItem: (item: SelectedItem) => set({ selectedItem: item }),
    
    toggleSQLDrawer: () => set((state) => ({ isSQLDrawerOpen: !state.isSQLDrawerOpen })),
    
    setGeneratedSQL: (sql: string) => set({ generatedSQL: sql }),
    
    getSelectedColumn: () => {
      const state = get();
      if (state.selectedItem.type === 'column' && state.selectedItem.tableId && state.selectedItem.columnId) {
        const columns = state.getTableColumns(state.selectedItem.tableId);
        return columns.find(col => col.id === state.selectedItem.columnId) || null;
      }
      return null;
    },
    
    getSelectedTable: () => {
      const state = get();
      if (state.selectedItem.type === 'table' && state.selectedItem.tableId) {
        return state.nodes.find(node => node.id === state.selectedItem.tableId) || null;
      }
      return null;
    }
}));