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

const nodeTypes = {
  tableNode: TableNode,
};

function AppContent() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } =
    useSQLTables();


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
            <Controls 
              position="bottom-right"
            />
            <Background 
              variant={BackgroundVariant.Dots} 
            />
          </ReactFlow>
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
