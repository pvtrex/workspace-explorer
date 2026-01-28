import { useState } from 'react';
import { 
  Power, Settings, User, Search, 
  FileText, Code, Briefcase, FolderOpen, Map, Mail,
  Monitor, Wifi, Volume2, Moon
} from 'lucide-react';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWindow: (windowId: string) => void;
  onShutdown: () => void;
}

const StartMenu = ({ isOpen, onClose, onOpenWindow, onShutdown }: StartMenuProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const pinnedApps = [
    { id: 'resume', icon: FileText, label: 'Resume', color: 'text-blue-400' },
    { id: 'skills', icon: Code, label: 'Skills', color: 'text-green-400' },
    { id: 'experience', icon: Briefcase, label: 'Experience', color: 'text-yellow-400' },
    { id: 'projects', icon: FolderOpen, label: 'Projects', color: 'text-purple-400' },
    { id: 'journey', icon: Map, label: 'Journey', color: 'text-orange-400' },
    { id: 'contact', icon: Mail, label: 'Contact', color: 'text-cyan-400' },
  ];

  const recentItems = [
    { label: 'Full Stack Developer Resume.pdf', icon: FileText },
    { label: 'React Projects Folder', icon: FolderOpen },
    { label: 'Skills Overview', icon: Code },
  ];

  if (!isOpen) return null;

  const handleAppClick = (id: string) => {
    onOpenWindow(id);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      {/* Start Menu */}
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-[600px] max-w-[95vw] glass-strong rounded-xl overflow-hidden z-50 animate-scale-in origin-bottom">
        {/* Search Bar */}
        <div className="p-4 border-b border-border/30">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Type to search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        {/* Pinned Apps */}
        <div className="p-4">
          <h3 className="text-xs font-medium text-muted-foreground mb-3">Pinned</h3>
          <div className="grid grid-cols-6 gap-2">
            {pinnedApps.map((app) => (
              <button
                key={app.id}
                onClick={() => handleAppClick(app.id)}
                className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-primary/10 transition-colors group"
              >
                <div className={`w-10 h-10 rounded-lg bg-secondary/80 flex items-center justify-center ${app.color} group-hover:scale-110 transition-transform`}>
                  <app.icon size={20} />
                </div>
                <span className="text-[11px] text-foreground/80 text-center truncate w-full">
                  {app.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent */}
        <div className="p-4 border-t border-border/30">
          <h3 className="text-xs font-medium text-muted-foreground mb-3">Recent</h3>
          <div className="space-y-1">
            {recentItems.map((item, i) => (
              <button
                key={i}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors text-left"
              >
                <item.icon size={16} className="text-muted-foreground" />
                <span className="text-sm text-foreground/80 truncate">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Bar - User & Power */}
        <div className="p-3 border-t border-border/30 flex items-center justify-between bg-secondary/50">
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <User size={16} className="text-primary" />
            </div>
            <span className="text-sm font-medium">Developer</span>
          </button>
          
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg hover:bg-primary/10 transition-colors" title="Settings">
              <Settings size={18} className="text-muted-foreground" />
            </button>
            <button 
              onClick={() => {
                onShutdown();
                onClose();
              }}
              className="p-2 rounded-lg hover:bg-red-500/20 transition-colors group" 
              title="Exit to Scene"
            >
              <Power size={18} className="text-muted-foreground group-hover:text-red-400" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StartMenu;
