import { useState, useEffect } from 'react';
import { 
  FileText, Code, Briefcase, FolderOpen, Map, Mail, 
  Wifi, Volume2, Battery, ChevronUp, Search
} from 'lucide-react';
import StartMenu from './StartMenu';

interface TaskbarProps {
  activeWindow: string | null;
  onIconClick: (window: string) => void;
  onHomeClick: () => void;
}

const Taskbar = ({ activeWindow, onIconClick, onHomeClick }: TaskbarProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [showSystemTray, setShowSystemTray] = useState(false);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pinnedApps = [
    { id: 'resume', icon: FileText, label: 'Resume' },
    { id: 'skills', icon: Code, label: 'Skills' },
    { id: 'experience', icon: Briefcase, label: 'Experience' },
    { id: 'projects', icon: FolderOpen, label: 'Projects' },
    { id: 'journey', icon: Map, label: 'Journey' },
    { id: 'contact', icon: Mail, label: 'Contact' },
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <>
      {/* Start Menu */}
      <StartMenu
        isOpen={startMenuOpen}
        onClose={() => setStartMenuOpen(false)}
        onOpenWindow={onIconClick}
        onShutdown={onHomeClick}
      />

      {/* System Tray Popup */}
      {showSystemTray && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowSystemTray(false)}
          />
          <div className="absolute bottom-14 right-4 w-80 glass-strong rounded-xl p-4 z-50 animate-scale-in origin-bottom-right">
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button className="flex flex-col items-center gap-2 p-3 rounded-lg bg-primary/20 hover:bg-primary/30 transition-colors">
                <Wifi size={20} className="text-primary" />
                <span className="text-[10px] text-foreground/80">Wi-Fi</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors">
                <Volume2 size={20} className="text-muted-foreground" />
                <span className="text-[10px] text-foreground/80">Sound</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-3 rounded-lg bg-secondary/50 hover:bg-secondary/70 transition-colors">
                <Battery size={20} className="text-muted-foreground" />
                <span className="text-[10px] text-foreground/80">Battery</span>
              </button>
            </div>
            
            {/* Volume Slider */}
            <div className="flex items-center gap-3 px-2">
              <Volume2 size={16} className="text-muted-foreground" />
              <div className="flex-1 h-1 bg-secondary rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-primary rounded-full" />
              </div>
              <span className="text-xs text-muted-foreground">75%</span>
            </div>
          </div>
        </>
      )}

      {/* Main Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-12 glass-strong flex items-center px-2 z-50">
        {/* Left Section - Start Button */}
        <div className="flex items-center">
          <button 
            onClick={() => setStartMenuOpen(!startMenuOpen)}
            className={`p-2.5 rounded-lg transition-all duration-200 ${startMenuOpen ? 'bg-primary/20' : 'hover:bg-primary/10'}`}
            title="Start"
          >
            {/* Windows-style Logo */}
            <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
              <div className="bg-primary rounded-sm" />
              <div className="bg-primary rounded-sm" />
              <div className="bg-primary rounded-sm" />
              <div className="bg-primary rounded-sm" />
            </div>
          </button>
          
          {/* Search */}
          <button className="p-2.5 rounded-lg hover:bg-primary/10 transition-colors ml-1" title="Search">
            <Search size={18} className="text-foreground/70" />
          </button>
        </div>

        {/* Center Section - Pinned Apps */}
        <div className="flex-1 flex items-center justify-center gap-1">
          {pinnedApps.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => onIconClick(id)}
              className={`relative p-2.5 rounded-lg transition-all duration-200 group ${
                activeWindow === id 
                  ? 'bg-primary/20' 
                  : 'hover:bg-primary/10'
              }`}
              title={label}
            >
              <Icon 
                size={20} 
                className={`transition-colors ${
                  activeWindow === id ? 'text-primary' : 'text-foreground/70 group-hover:text-primary'
                }`} 
              />
              
              {/* Active Indicator */}
              {activeWindow === id && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />
              )}
              
              {/* Tooltip */}
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-card border border-border/50 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                {label}
              </span>
            </button>
          ))}
        </div>
        
        {/* Right Section - System Tray */}
        <div className="flex items-center gap-1">
          {/* Hidden Icons Arrow */}
          <button 
            onClick={() => setShowSystemTray(!showSystemTray)}
            className="p-1.5 rounded hover:bg-primary/10 transition-colors"
          >
            <ChevronUp size={14} className="text-muted-foreground" />
          </button>
          
          {/* System Icons */}
          <div className="flex items-center gap-0.5 px-2">
            <Wifi size={14} className="text-foreground/70" />
            <Volume2 size={14} className="text-foreground/70" />
            <Battery size={14} className="text-foreground/70" />
          </div>
          
          {/* Clock & Date */}
          <button className="flex flex-col items-end px-3 py-1 rounded hover:bg-primary/10 transition-colors">
            <span className="text-xs font-mono text-foreground/90 leading-tight">
              {formatTime(currentTime)}
            </span>
            <span className="text-[10px] text-muted-foreground leading-tight">
              {formatDate(currentTime)}
            </span>
          </button>
          
          {/* Notification Badge */}
          <div className="relative p-2 rounded hover:bg-primary/10 transition-colors cursor-pointer">
            <div className="w-1 h-1 bg-primary rounded-full absolute top-1.5 right-1.5" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Taskbar;
