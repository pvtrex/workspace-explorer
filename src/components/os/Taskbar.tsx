import { FileText, Code, Briefcase, FolderOpen, Map, Mail, Home } from 'lucide-react';

interface TaskbarProps {
  activeWindow: string | null;
  onIconClick: (window: string) => void;
  onHomeClick: () => void;
}

const Taskbar = ({ activeWindow, onIconClick, onHomeClick }: TaskbarProps) => {
  const icons = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'resume', icon: FileText, label: 'Resume' },
    { id: 'skills', icon: Code, label: 'Skills' },
    { id: 'experience', icon: Briefcase, label: 'Experience' },
    { id: 'projects', icon: FolderOpen, label: 'Projects' },
    { id: 'journey', icon: Map, label: 'Journey' },
    { id: 'contact', icon: Mail, label: 'Contact' },
  ];

  return (
    <div className="taskbar">
      <div className="flex items-center gap-1">
        {icons.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => id === 'home' ? onHomeClick() : onIconClick(id)}
            className={`taskbar-icon ${activeWindow === id ? 'active' : ''}`}
            title={label}
          >
            <Icon size={20} className="text-foreground/80" />
          </button>
        ))}
      </div>
      
      {/* Clock */}
      <div className="absolute right-4 text-xs text-muted-foreground font-mono">
        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
};

export default Taskbar;
