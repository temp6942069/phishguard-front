import { cn } from "@/lib/utils";
import { Clock, ExternalLink, ShieldAlert, ShieldCheck } from "lucide-react";
import { ScanResult } from "./ResultDisplay";

export interface ScanEntry {
  id: string;
  url: string;
  result: ScanResult;
  timestamp: Date;
}

interface ScanHistoryProps {
  entries: ScanEntry[];
  className?: string;
}

export const ScanHistory = ({ entries, className }: ScanHistoryProps) => {
  if (entries.length === 0) {
    return (
      <div className={cn("glass rounded-xl p-6", className)}>
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Scan History
        </h3>
        <div className="text-center py-8 text-muted-foreground">
          <p className="font-mono text-sm">No scans yet</p>
          <p className="text-xs mt-1">Enter a URL above to start scanning</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("glass rounded-xl p-6", className)}>
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5 text-primary" />
        Scan History
        <span className="ml-auto text-xs font-mono text-muted-foreground">
          {entries.length} scan{entries.length !== 1 ? 's' : ''}
        </span>
      </h3>
      
      <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
        {entries.map((entry) => {
          const isSafe = entry.result === "SAFE";
          return (
            <div
              key={entry.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                isSafe
                  ? "border-success/20 bg-success/5 hover:bg-success/10"
                  : "border-destructive/20 bg-destructive/5 hover:bg-destructive/10"
              )}
            >
              {/* Status icon */}
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  isSafe
                    ? "bg-success/20 text-success"
                    : "bg-destructive/20 text-destructive"
                )}
              >
                {isSafe ? (
                  <ShieldCheck className="h-4 w-4" />
                ) : (
                  <ShieldAlert className="h-4 w-4" />
                )}
              </div>

              {/* URL and time */}
              <div className="flex-1 min-w-0">
                <p className="font-mono text-sm truncate text-foreground">
                  {entry.url}
                </p>
                <p className="text-xs text-muted-foreground">
                  {entry.timestamp.toLocaleTimeString()}
                </p>
              </div>

              {/* Status badge */}
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-xs font-mono uppercase",
                  isSafe
                    ? "bg-success/20 text-success"
                    : "bg-destructive/20 text-destructive"
                )}
              >
                {entry.result}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
