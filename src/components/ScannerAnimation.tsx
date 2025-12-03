import { cn } from "@/lib/utils";

interface ScannerAnimationProps {
  isScanning: boolean;
  className?: string;
}

export const ScannerAnimation = ({ isScanning, className }: ScannerAnimationProps) => {
  if (!isScanning) return null;

  return (
    <div className={cn("relative w-full h-48 overflow-hidden rounded-xl border border-primary/30 bg-card/30", className)}>
      {/* Grid background */}
      <div className="absolute inset-0 cyber-grid opacity-50" />
      
      {/* Scanning line */}
      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />
      
      {/* Center pulse */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Pulse rings */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-pulse-ring" style={{ width: 80, height: 80, margin: -20 }} />
          <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-pulse-ring" style={{ width: 80, height: 80, margin: -20, animationDelay: '0.5s' }} />
          
          {/* Center icon */}
          <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center glow-primary">
            <svg className="w-5 h-5 text-primary animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Status text */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="font-mono text-sm text-primary animate-pulse">
          ANALYZING URL...
        </p>
      </div>
    </div>
  );
};
