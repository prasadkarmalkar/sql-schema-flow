import { Button } from "./ui/button";
import { useSQLTables } from "../stores/sql-tables";
import { 
  ChevronDown, 
  Copy, 
  Download, 
  Code2,
  CheckCircle2
} from "lucide-react";
import { useState } from "react";

const BottomDrawer = () => {
  const { 
    isSQLDrawerOpen, 
    toggleSQLDrawer, 
    generatedSQL,
    projectName 
  } = useSQLTables();
  
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedSQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedSQL], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}.sql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isSQLDrawerOpen) {
    return null;
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-neutral-200 shadow-2xl z-50">
      {/* Header */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-neutral-200 bg-neutral-50">
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium ">Generated SQL</span>
          <span className="text-xs ">
            {generatedSQL.split('\n').filter(line => line.trim()).length} lines
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="h-7 text-xs gap-1.5"
          >
            {copied ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleDownload}
            className="text-xs gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </Button>

          <div className="w-px h-4 bg-neutral-200 mx-1" />

          <Button
            size="icon"
            variant="ghost"
            onClick={toggleSQLDrawer}
            className="h-7 w-7"
            title="Close"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* SQL Content */}
      <div className="h-64 overflow-auto">
        <pre className="p-4 text-sm font-mono leading-relaxed ">
          <code>{generatedSQL || '-- No SQL generated yet. Click "Generate SQL" to create schema.'}</code>
        </pre>
      </div>

      {/* Footer hint */}
      <div className="h-6 px-4 flex items-center justify-center bg-neutral-50 border-t border-neutral-200">
        <p className="text-xs ">
          Press <kbd className="px-1.5 py-0.5 bg-white border border-neutral-300 rounded text-xs font-mono">⌘ J</kbd> to toggle
        </p>
      </div>
    </div>
  );
};

export default BottomDrawer;
