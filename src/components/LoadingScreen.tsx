import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);

  const loadingMessages = [
    "Initializing Developer Workspace...",
    "Loading Projects & Experience...",
    "Compiling Skills Database...",
    "Rendering 3D Environment...",
    "Booting Portfolio OS...",
    "Almost ready..."
  ];

  useEffect(() => {
    const duration = 2500;
    const interval = 20;
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setIsExiting(true);
          setTimeout(onComplete, 500);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Rotate through messages based on progress
  useEffect(() => {
    const messageIndex = Math.min(
      Math.floor(progress / (100 / loadingMessages.length)),
      loadingMessages.length - 1
    );
    setCurrentMessage(messageIndex);
  }, [progress]);

  return (
    <div
      className={`fixed inset-0 bg-background flex flex-col items-center justify-center z-50 transition-opacity duration-500 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Logo/Brand */}
      <div className="mb-8 text-center">
        <div className="text-5xl font-bold text-gradient mb-4 animate-pulse">{'<Dev />'}</div>
        <p className="text-foreground/90 text-lg font-medium mb-2">
          Interactive Portfolio Experience
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-72 h-1.5 bg-secondary rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-100 ease-out relative"
          style={{ width: `${progress}%` }}
        >
          {/* Glow effect */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full blur-md" />
        </div>
      </div>

      {/* Dynamic Message */}
      <div className="h-6 flex items-center justify-center">
        <p 
          key={currentMessage}
          className="text-sm font-mono text-primary animate-fade-in"
        >
          {loadingMessages[currentMessage]}
        </p>
      </div>

      {/* Percentage */}
      <p className="mt-2 text-xs font-mono text-muted-foreground">
        {Math.round(progress)}%
      </p>

      {/* Terminal-like output */}
      <div className="mt-8 w-72 text-left">
        <div className="space-y-1">
          {progress > 20 && (
            <p className="text-xs font-mono text-muted-foreground/60 animate-fade-in">
              <span className="text-green-500">✓</span> Environment loaded
            </p>
          )}
          {progress > 40 && (
            <p className="text-xs font-mono text-muted-foreground/60 animate-fade-in">
              <span className="text-green-500">✓</span> 3D assets compiled
            </p>
          )}
          {progress > 60 && (
            <p className="text-xs font-mono text-muted-foreground/60 animate-fade-in">
              <span className="text-green-500">✓</span> Portfolio data ready
            </p>
          )}
          {progress > 80 && (
            <p className="text-xs font-mono text-muted-foreground/60 animate-fade-in">
              <span className="text-green-500">✓</span> OS interface initialized
            </p>
          )}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
};

export default LoadingScreen;
