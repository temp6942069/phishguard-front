import { cn } from "@/lib/utils";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";

export type ScanResult = "SAFE" | "PHISHING" | null;

interface ResultDisplayProps {
  result: ScanResult;
  url: string;
  className?: string;
}

export const ResultDisplay = ({ result, url, className }: ResultDisplayProps) => {
  if (!result) return null;

  const isSafe = result === "SAFE";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border p-6 transition-all duration-500",
        isSafe 
          ? "border-success/50 bg-success/5 glow-success" 
          : "border-destructive/50 bg-destructive/5 glow-destructive",
        className
      )}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 cyber-grid opacity-20" />
      
      <div className="relative flex items-center gap-6">
        {/* Icon */}
        <div
          className={cn(
            "flex h-20 w-20 items-center justify-center rounded-xl border-2 transition-all",
            isSafe
              ? "border-success bg-success/20 text-success"
              : "border-destructive bg-destructive/20 text-destructive animate-pulse"
          )}
        >
          {isSafe ? (
            <ShieldCheck className="h-10 w-10" />
          ) : (
            <ShieldAlert className="h-10 w-10" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono uppercase tracking-wider",
                isSafe
                  ? "bg-success/20 text-success border border-success/30"
                  : "bg-destructive/20 text-destructive border border-destructive/30"
              )}
            >
              {isSafe ? "✓ SECURE" : "⚠ THREAT DETECTED"}
            </span>
          </div>
          
          <h3
            className={cn(
              "text-2xl font-bold mb-1",
              isSafe ? "text-success" : "text-destructive"
            )}
          >
            {isSafe ? "Website is Safe" : "Phishing Detected!"}
          </h3>
          
          <p className="font-mono text-sm text-muted-foreground truncate max-w-md">
            {url}
          </p>
        </div>

        {/* Status indicator */}
        <div className="hidden sm:flex flex-col items-end gap-1">
          <span className="font-mono text-xs text-muted-foreground uppercase">Status</span>
          <span
            className={cn(
              "font-mono text-lg font-bold",
              isSafe ? "text-success" : "text-destructive"
            )}
          >
            {result}
          </span>
        </div>
      </div>

      {/* Warning message for phishing */}
      {!isSafe && (
        <div className="relative mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
          <p className="text-sm text-destructive">
            <strong>Warning:</strong> This website has been identified as a potential phishing attempt. 
            Do not enter any personal information or credentials.
          </p>
        </div>
      )}
    </div>
  );
};
