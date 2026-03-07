import { useState } from "react";
import { Input } from "./ui/input";
import {
  Search,
  Table2,
  Layers,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSQLTables } from "../stores/sql-tables";
import { useReactFlow } from "@xyflow/react";

const LeftSidebar = () => {
  const { nodes, setSelectedItem } = useSQLTables();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const reactFlow = useReactFlow();

  const filteredTables = nodes.filter((node) => {
    const label = (node.data?.label as string) || "";
    return label.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleTableClick = (tableId: string) => {
    setSelectedItem({ type: "table", tableId });

    // Focus the table on canvas
    const node = nodes.find((n) => n.id === tableId);
    if (node && reactFlow) {
      reactFlow.setCenter(node.position.x + 150, node.position.y + 100, {
        zoom: 1,
        duration: 400,
      });
    }
  };

  const getColumnCount = (tableId: string) => {
    const node = nodes.find((n) => n.id === tableId);
    const columns = node?.data?.columns as unknown[];
    return columns?.length || 0;
  };

  return (
    <div
      className={`relative h-full bg-neutral-50 border-r border-neutral-200 flex flex-col transition-all duration-300 ${isCollapsed ? "w-12" : "w-72"}`}
    >
      {/* Collapse Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className='absolute top-1/2 -right-4 z-10 bg-white border border-neutral-200 rounded-full p-1.5 hover:bg-neutral-100 shadow-sm transition-colors'
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className='size-3.5' />
        ) : (
          <ChevronLeft className='size-3.5' />
        )}
      </button>

      {!isCollapsed && (
        <>
          {/* Header */}
          <div className='p-4 border-b border-neutral-200'>
            <div className='flex items-center gap-2 mb-3'>
              <Layers className='size-5 text-primary' />
              <h2>Tables</h2>
              <span className='ml-auto mr-2 text-xs bg-neutral-200 px-2 py-0.5 rounded-full'>
                {nodes.length}
              </span>
            </div>

            {/* Search */}
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 size-4 ' />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder='Search tables...'
                className='pl-9 h-9 bg-white border-neutral-300 text-sm'
              />
            </div>
          </div>

          {/* Table List */}
          <div className='flex-1 overflow-y-auto p-2'>
            {filteredTables.length === 0 ? (
              <div className='flex flex-col items-center justify-center h-32  text-sm'>
                <Table2 className='size-8 mb-2 opacity-50' />
                {searchQuery ? "No tables found" : "No tables yet"}
              </div>
            ) : (
              <div className='space-y-1'>
                {filteredTables.map((node) => (
                  <button
                    key={node.id}
                    onClick={() => handleTableClick(node.id)}
                    className='w-full text-left p-3 rounded-lg hover:bg-white border border-transparent hover:border-neutral-200 transition-all group'
                  >
                    <div className='flex items-center gap-2'>
                      <Table2 className='size-4 transition-colors' />
                      <div className='flex-1 min-w-0'>
                        <div className='text-sm font-medium truncate'>
                          {(node.data?.label as string) || "Untitled"}
                        </div>
                        <div className='text-xs '>
                          {getColumnCount(node.id)} columns
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LeftSidebar;
