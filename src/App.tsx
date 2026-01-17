import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./App.css";
import TableNode from "./components/TableNode";
import { Button } from "./components/ui/button";
import { Table2 } from "lucide-react";
import { useSQLTables, type Column } from "./stores/sql-tables";

const nodeTypes = {
  tableNode: TableNode,
};
function App() {
  const { nodes, edges, addTable, onNodesChange, onEdgesChange, onConnect } =
    useSQLTables();

  const handleAddTable = () => {
    const newTable = {
      id: `table-${Date.now()}`,
      type: "tableNode",
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        label: `Table${nodes.length + 1}`,
        columns: [
          {
            id: Date.now().toString(),
            name: "",
            dataType: "",
            size: "",
          },
        ],
      },
    };
    addTable(newTable);
  };

  const generateSQL = () => {
    let generatedQuery = "";
    nodes.forEach((node) => {
      const tableName = node.data.label;
      const columns = Array.isArray(node.data.columns) ? node.data.columns : [];
      let createTableQuery = `CREATE TABLE ${tableName} (\n`;
      columns.forEach((col: Column, index: number) => {
        createTableQuery += `  ${col.name} ${col.dataType}`;
        if (col.size) {
          createTableQuery += `(${col.size})`;
        }
        if (index < columns.length - 1) {
          createTableQuery += ",\n";
        } else {
          createTableQuery += "\n";
        }
      });
      createTableQuery += ");";
      generatedQuery += createTableQuery + "\n\n";
    });
  };

  return (
    <>
      <div style={{ width: "100%", height: "100vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          minZoom={0.2}
          maxZoom={2}
        >
          <Controls />
          <Background variant={BackgroundVariant.Dots} />
        </ReactFlow>
        <Button className='absolute top-2 left-2' onClick={handleAddTable}>
          <Table2 />
          Add Table
        </Button>
        <Button
          className='absolute top-2 left-36'
          variant='default'
          onClick={generateSQL}
        >
          Generate SQL
        </Button>
      </div>
    </>
  );
}

export default App;
