import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, BackgroundVariant, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './App.css'
import { useCallback, useState } from 'react';
import TableNode from './components/TableNode';
import { Button } from './components/ui/button';
import { Table2 } from 'lucide-react';

const initialNodes = [
  { id: 'n1', type: 'tableNode', position: { x: 50, y: 50 }, data: { label: 'Node 1' }, },
];
const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];
const nodeTypes = {
  tableNode: TableNode,
};
function App() {

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

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
         defaultZoom={1}
         minZoom={0.2}
         maxZoom={2}
         >
          <Controls />
          <Background variant={BackgroundVariant.Dots} />
        </ReactFlow>
        <Button className='absolute top-2 left-2'><Table2 />Add Table</Button>
      </div>
    </>
  )
}

export default App
