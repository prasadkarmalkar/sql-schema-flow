import { ReactFlow, Background, BackgroundVariant, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './App.css'
import TableNode from './components/TableNode';
import { Button } from './components/ui/button';
import { Table2 } from 'lucide-react';
import { useSQLTables } from './stores/sql-tables';

const nodeTypes = {
  tableNode: TableNode,
};
function App() {
  const {nodes, edges, addTable, onNodesChange, onEdgesChange, onConnect} = useSQLTables();

  const handleAddTable = () => {
    const newTable = {
      id: `table-${nodes.length + 1}`,
      type: 'tableNode',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `Table${nodes.length + 1}` },
    };
    addTable(newTable);
  }

  const generateSQL = () => {
    
  };

  return (
    <>
      <div style={{ width: '100%', height: '100vh' }}>
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
        <Button className='absolute top-2 left-2' onClick={handleAddTable}><Table2 />Add Table</Button>
        <Button className='absolute top-2 left-36' variant='default' onClick={generateSQL}>Generate SQL</Button>
      </div>
    </>
  )
}

export default App
