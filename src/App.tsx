import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./App.css";
import TableNode from "./components/TableNode";
import TopNavBar from "./components/TopNavBar";
import LeftSidebar from "./components/LeftSidebar";
import RightSidebar from "./components/RightSidebar";
import BottomDrawer from "./components/BottomDrawer";
import { useSQLTables } from "./stores/sql-tables";
import { Table2, GitBranch } from "lucide-react";

const nodeTypes = {
  tableNode: TableNode,
};

function AppContent() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addTable } =
    useSQLTables();

  const handleAddFirstTable = () => {
    const newTable = {
      id: `table-${Date.now()}`,
      type: "tableNode",
      position: { x: 250, y: 150 },
      data: {
        label: "Table1",
        columns: [
          {
            id: Date.now().toString(),
            name: "id",
            dataType: "INT",
            size: "",
            isPrimaryKey: true,
            isForeignKey: false,
            isNullable: false,
            isUnique: true,
            isAutoIncrement: true,
            defaultValue: "",
            description: "Primary key",
          },
        ],
      },
    };
    addTable(newTable);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
      {/* Top Navigation */}
      <TopNavBar />
  
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar - Tables List */}
        <LeftSidebar />

        {/* Canvas Area - ER Diagram */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            minZoom={0.2}
            maxZoom={2}
            snapToGrid
            snapGrid={[16, 16]}
          >
            <Controls position="bottom-right" />
            <Background variant={BackgroundVariant.Dots} />
          </ReactFlow>

          {/* Empty state overlay */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center pointer-events-auto">
                <div className="flex justify-center mb-4">
                  <div className="bg-neutral-100 rounded-2xl p-5">
                    <GitBranch className="size-10 text-neutral-400" />
                  </div>
                </div>
                <h2 className="text-lg font-semibold text-neutral-700 mb-1">
                  Start building your schema
                </h2>
                <p className="text-sm text-neutral-400 mb-5 max-w-xs">
                  Add tables to the canvas, define columns, and connect them to visualize your database structure.
                </p>
                <button
                  onClick={handleAddFirstTable}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  <Table2 className="size-4" />
                  Add your first table
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Properties Panel */}
        <RightSidebar />

        {/* Bottom SQL Drawer */}
        <BottomDrawer />
      </div>
    </div>
  );
}

function App() {
  return (
    <ReactFlowProvider>
      <AppContent />
    </ReactFlowProvider>
  );
}

export default App;
