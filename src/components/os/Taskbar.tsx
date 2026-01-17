import { useState, useEffect } from 'react';
import { FileText, Code, Briefcase, FolderOpen, Map, Mail, Home } from 'lucide-react';

interface TaskbarProps {
  activeWindow: string | null;
  onIconClick: (window: string) => void;
  onHomeClick: () => void;
}

const Taskbar = ({ activeWindow, onIconClick, onHomeClick }: TaskbarProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const icons = [
    { id: 'home', icon: Home, label: 'Home' },
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
    <div className="taskbar">
      <div className="flex items-center gap-1">
        {icons.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => id === 'home' ? onHomeClick() : onIconClick(id)}
            className={`taskbar-icon group relative ${activeWindow === id ? 'active' : ''}`}
            title={label}
          >
            <Icon size={20} className="text-foreground/80 group-hover:text-primary transition-colors" />
            {/* Tooltip */}
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-card text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {label}
            </span>
          </button>
        ))}
      </div>
      
      {/* System Tray */}
      <div className="absolute right-4 flex items-center gap-4">
        {/* Status indicators */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span>Online</span>
        </div>
        
        {/* Clock */}
        <div className="text-right">
          <p className="text-xs font-mono text-foreground/90">{formatTime(currentTime)}</p>
          <p className="text-[10px] text-muted-foreground">{formatDate(currentTime)}</p>
        </div>
      </div>
    </div>
  );
};

export default Taskbar;
