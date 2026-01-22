import { useState, useEffect, useCallback } from 'react';
import { FileText, Code, Briefcase, FolderOpen, Map, Mail, Copy, RefreshCw, Trash2 } from 'lucide-react';
import DesktopIcon from './DesktopIcon';
import Window from './Window';
import Taskbar from './Taskbar';
import ResumeWindow from './windows/ResumeWindow';
import SkillsWindow from './windows/SkillsWindow';
import ExperienceWindow from './windows/ExperienceWindow';
import ProjectsWindow from './windows/ProjectsWindow';
import JourneyWindow from './windows/JourneyWindow';
import ContactWindow from './windows/ContactWindow';

interface DesktopProps {
  onExit: () => void;
  isEmbedded?: boolean;
}

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
}

const Desktop = ({ onExit, isEmbedded = false }: DesktopProps) => {
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({ visible: false, x: 0, y: 0 });

  const icons = [
    { id: 'resume', icon: FileText, label: 'Resume.pdf' },
    { id: 'skills', icon: Code, label: 'Skills' },
    { id: 'experience', icon: Briefcase, label: 'Experience' },
    { id: 'projects', icon: FolderOpen, label: 'Projects' },
    { id: 'journey', icon: Map, label: 'My Journey' },
    { id: 'contact', icon: Mail, label: 'Contact' },
  ];

  // Play subtle sound on window open
  const playOpenSound = useCallback(() => {
    // Create a subtle click sound using Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch {
      // Audio not supported, fail silently
    }
  }, []);

  const handleOpenWindow = (id: string) => {
    setActiveWindow(id);
    playOpenSound();
  };

  // Context menu handler
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
    });
  };

  // Close context menu on click
  useEffect(() => {
    const handleClick = () => setContextMenu({ ...contextMenu, visible: false });
    if (contextMenu.visible) {
      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
    }
  }, [contextMenu.visible]);

  const renderWindow = () => {
    switch (activeWindow) {
      case 'resume':
        return <ResumeWindow />;
      case 'skills':
        return <SkillsWindow />;
      case 'experience':
        return <ExperienceWindow />;
      case 'projects':
        return <ProjectsWindow />;
      case 'journey':
        return <JourneyWindow />;
      case 'contact':
        return <ContactWindow />;
      default:
        return null;
    }
  };

  const getWindowTitle = () => {
    const titles: Record<string, string> = {
      resume: 'Resume - Document Viewer',
      skills: 'Skills - Technical Proficiencies',
      experience: 'Experience - Career Timeline',
      projects: 'Projects - Portfolio',
      journey: 'My Journey - Personal Story',
      contact: 'Contact - Get In Touch',
    };
    return titles[activeWindow || ''] || '';
  };

  return (
    <div 
      className={`${isEmbedded ? 'absolute inset-0' : 'fixed inset-0'} bg-background animate-fade-in overflow-hidden`}
      onContextMenu={handleContextMenu}
    >
      {/* Desktop Background Pattern */}
      <div className="absolute inset-0 bg-gradient-dark opacity-80" />
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Desktop Icons Grid */}
      <div className="absolute top-4 left-4 grid grid-cols-2 gap-2 p-4 z-0">
        {icons.map((item) => (
          <DesktopIcon
            key={item.id}
            icon={item.icon}
            label={item.label}
            onClick={() => handleOpenWindow(item.id)}
            isActive={activeWindow === item.id}
          />
        ))}
      </div>

      {/* Active Window */}
      <Window
        title={getWindowTitle()}
        isOpen={!!activeWindow}
        onClose={() => setActiveWindow(null)}
      >
        {renderWindow()}
      </Window>

      {/* Context Menu */}
      {contextMenu.visible && (
        <div 
          className="fixed glass-strong rounded-lg py-2 min-w-[180px] z-50 animate-scale-in"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button className="w-full px-4 py-2 text-sm text-left hover:bg-primary/10 flex items-center gap-3 transition-colors">
            <RefreshCw size={14} className="text-muted-foreground" />
            Refresh
          </button>
          <button className="w-full px-4 py-2 text-sm text-left hover:bg-primary/10 flex items-center gap-3 transition-colors">
            <Copy size={14} className="text-muted-foreground" />
            Copy
          </button>
          <div className="border-t border-border/50 my-1" />
          <button className="w-full px-4 py-2 text-sm text-left hover:bg-primary/10 flex items-center gap-3 transition-colors text-muted-foreground">
            <Trash2 size={14} />
            Delete (disabled)
          </button>
          <div className="border-t border-border/50 my-1" />
          <div className="px-4 py-2 text-xs text-muted-foreground">
            Portfolio OS v1.0
          </div>
        </div>
      )}

      {/* Taskbar */}
      <Taskbar
        activeWindow={activeWindow}
        onIconClick={handleOpenWindow}
        onHomeClick={onExit}
      />
    </div>
  );
};

export default Desktop;
