import { useState, useEffect, useCallback } from 'react';
import { 
  FileText, Code, Briefcase, FolderOpen, Map, Mail, 
  Copy, RefreshCw, Trash2, Settings, Image, Terminal,
  Globe, Folder
} from 'lucide-react';
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
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  // Main portfolio icons
  const portfolioIcons = [
    { id: 'resume', icon: FileText, label: 'Resume.pdf', color: 'text-blue-400' },
    { id: 'skills', icon: Code, label: 'Skills', color: 'text-green-400' },
    { id: 'experience', icon: Briefcase, label: 'Experience', color: 'text-yellow-400' },
    { id: 'projects', icon: FolderOpen, label: 'Projects', color: 'text-purple-400' },
    { id: 'journey', icon: Map, label: 'My Journey', color: 'text-orange-400' },
    { id: 'contact', icon: Mail, label: 'Contact', color: 'text-cyan-400' },
  ];

  // Secondary/decorative icons
  const systemIcons = [
    { id: 'github', icon: Globe, label: 'GitHub', color: 'text-muted-foreground' },
    { id: 'downloads', icon: Folder, label: 'Downloads', color: 'text-yellow-300' },
  ];

  // Play subtle sound on window open
  const playOpenSound = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.03, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.08);
    } catch {
      // Audio not supported
    }
  }, []);

  const handleOpenWindow = (id: string) => {
    // Only open portfolio windows, system icons are decorative
    if (portfolioIcons.find(icon => icon.id === id)) {
      setActiveWindow(id);
      playOpenSound();
    }
    setSelectedIcon(id);
  };

  const handleDoubleClick = (id: string) => {
    if (portfolioIcons.find(icon => icon.id === id)) {
      setActiveWindow(id);
      playOpenSound();
    }
  };

  // Context menu handler
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: Math.min(e.clientX, window.innerWidth - 200),
      y: Math.min(e.clientY, window.innerHeight - 200),
    });
  };

  // Close context menu and selection on click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.desktop-icon-btn')) {
        setSelectedIcon(null);
      }
      setContextMenu({ ...contextMenu, visible: false });
    };
    
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
      className={`${isEmbedded ? 'absolute inset-0' : 'fixed inset-0'} bg-background overflow-hidden`}
      onContextMenu={handleContextMenu}
      onClick={() => setSelectedIcon(null)}
    >
      {/* Wallpaper - Dark glass with subtle pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background" />
      
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-accent/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Desktop Icons - Left column */}
      <div className="absolute top-4 left-4 flex flex-col gap-1 z-0 p-2">
        {portfolioIcons.map((item) => (
          <div 
            key={item.id} 
            className="desktop-icon-btn"
            onDoubleClick={() => handleDoubleClick(item.id)}
          >
            <DesktopIcon
              icon={item.icon}
              label={item.label}
              color={item.color}
              onClick={() => handleOpenWindow(item.id)}
              isActive={selectedIcon === item.id || activeWindow === item.id}
            />
          </div>
        ))}
        
        {/* Separator */}
        <div className="h-4" />
        
        {/* System icons */}
        {systemIcons.map((item) => (
          <div key={item.id} className="desktop-icon-btn">
            <DesktopIcon
              icon={item.icon}
              label={item.label}
              color={item.color}
              onClick={() => setSelectedIcon(item.id)}
              isActive={selectedIcon === item.id}
            />
          </div>
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
          className="fixed glass-strong rounded-lg py-1.5 min-w-[200px] z-50 animate-scale-in shadow-2xl border border-border/50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="w-full px-4 py-2 text-sm text-left hover:bg-primary/10 flex items-center gap-3 transition-colors">
            <RefreshCw size={14} className="text-muted-foreground" />
            Refresh Desktop
          </button>
          <button className="w-full px-4 py-2 text-sm text-left hover:bg-primary/10 flex items-center gap-3 transition-colors">
            <Image size={14} className="text-muted-foreground" />
            Change Wallpaper
          </button>
          <div className="border-t border-border/30 my-1" />
          <button className="w-full px-4 py-2 text-sm text-left hover:bg-primary/10 flex items-center gap-3 transition-colors">
            <Terminal size={14} className="text-muted-foreground" />
            Open Terminal
          </button>
          <button className="w-full px-4 py-2 text-sm text-left hover:bg-primary/10 flex items-center gap-3 transition-colors">
            <Settings size={14} className="text-muted-foreground" />
            Display Settings
          </button>
          <div className="border-t border-border/30 my-1" />
          <div className="px-4 py-2 text-[10px] text-muted-foreground font-mono">
            Portfolio OS v2.0 • © 2024
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
