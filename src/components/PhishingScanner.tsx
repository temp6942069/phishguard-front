import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScannerAnimation } from "./ScannerAnimation";
import { ResultDisplay, ScanResult } from "./ResultDisplay";
import { ScanHistory, ScanEntry } from "./ScanHistory";
import { toast } from "@/hooks/use-toast";
import { Globe, Scan, Shield, Zap } from "lucide-react";

// Mock API endpoint - replace with your actual Flask backend URL
const API_URL = "http://localhost:5000/scan";

export const PhishingScanner = () => {
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScanResult>(null);
  const [scannedUrl, setScannedUrl] = useState("");
  const [history, setHistory] = useState<ScanEntry[]>([]);

  const validateUrl = (input: string): boolean => {
    try {
      new URL(input);
      return true;
    } catch {
      return false;
    }
  };

  const handleScan = async () => {
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to scan.",
        variant: "destructive",
      });
      return;
    }

    // Add protocol if missing
    let urlToScan = url.trim();
    if (!urlToScan.startsWith("http://") && !urlToScan.startsWith("https://")) {
      urlToScan = "https://" + urlToScan;
    }

    if (!validateUrl(urlToScan)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL.",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    setResult(null);
    setScannedUrl(urlToScan);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: urlToScan }),
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();
      const scanResult: ScanResult = data.result === "PHISHING" ? "PHISHING" : "SAFE";
      
      setResult(scanResult);
      
      // Add to history
      const newEntry: ScanEntry = {
        id: Date.now().toString(),
        url: urlToScan,
        result: scanResult,
        timestamp: new Date(),
      };
      setHistory((prev) => [newEntry, ...prev].slice(0, 20));

      toast({
        title: scanResult === "SAFE" ? "✓ Website is Safe" : "⚠ Phishing Detected",
        description: scanResult === "SAFE" 
          ? "No threats detected on this website."
          : "This website has been flagged as potentially dangerous.",
        variant: scanResult === "SAFE" ? "default" : "destructive",
      });
    } catch (error) {
      // Demo mode: simulate response when backend is not available
      const simulatedResult: ScanResult = urlToScan.includes("paypal") || 
        urlToScan.includes("login") || 
        urlToScan.includes(".shop") ||
        urlToScan.includes("secure-") 
          ? "PHISHING" 
          : "SAFE";
      
      setResult(simulatedResult);
      
      const newEntry: ScanEntry = {
        id: Date.now().toString(),
        url: urlToScan,
        result: simulatedResult,
        timestamp: new Date(),
      };
      setHistory((prev) => [newEntry, ...prev].slice(0, 20));

      toast({
        title: "Demo Mode",
        description: "Backend not connected. Showing simulated result.",
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
        {/* Header */}
        <header className="border-b border-border/50 bg-card/30 backdrop-blur-xl">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 border border-primary/50 glow-primary">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">PhishGuard</h1>
                <p className="text-xs text-muted-foreground font-mono">AI-Powered Threat Detection</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 md:py-16">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-mono text-primary mb-6">
                <Zap className="h-3.5 w-3.5" />
                Real-time URL Analysis
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Detect <span className="text-gradient">Phishing</span> Threats
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Enter any URL to instantly analyze it for phishing indicators using our 
                multimodal AI detection system.
              </p>
            </div>

            {/* Scanner Input */}
            <div className="glass rounded-2xl p-6 md:p-8 mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !isScanning && handleScan()}
                    disabled={isScanning}
                    className="pl-12 h-14 text-base"
                  />
                </div>
                <Button
                  variant="scan"
                  size="xl"
                  onClick={handleScan}
                  disabled={isScanning}
                  className="min-w-[160px]"
                >
                  {isScanning ? (
                    <>
                      <span className="animate-pulse">Scanning</span>
                      <span className="animate-pulse">...</span>
                    </>
                  ) : (
                    <>
                      <Scan className="h-5 w-5" />
                      Scan URL
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Scanner Animation */}
            {isScanning && (
              <div className="mb-8">
                <ScannerAnimation isScanning={isScanning} />
              </div>
            )}

            {/* Result Display */}
            {result && !isScanning && (
              <div className="mb-8">
                <ResultDisplay result={result} url={scannedUrl} />
              </div>
            )}

            {/* History */}
            <ScanHistory entries={history} />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/50 bg-card/30 backdrop-blur-xl mt-auto">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <p className="font-mono text-xs">
                Connect your Flask backend at <code className="text-primary">localhost:5000</code>
              </p>
              <p className="text-xs">
                Powered by multimodal AI threat detection
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
