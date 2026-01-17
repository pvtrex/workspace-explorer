import { useState } from 'react';
import { FileText, Code, Briefcase, FolderOpen, Map, Mail } from 'lucide-react';
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
}

const Desktop = ({ onExit }: DesktopProps) => {
  const [activeWindow, setActiveWindow] = useState<string | null>(null);

  const icons = [
    { id: 'resume', icon: FileText, label: 'Resume.pdf' },
    { id: 'skills', icon: Code, label: 'Skills' },
    { id: 'experience', icon: Briefcase, label: 'Experience' },
    { id: 'projects', icon: FolderOpen, label: 'Projects' },
    { id: 'journey', icon: Map, label: 'My Journey' },
    { id: 'contact', icon: Mail, label: 'Contact' },
  ];

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
    <div className="fixed inset-0 bg-background animate-fade-in overflow-hidden">
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
            onClick={() => setActiveWindow(item.id)}
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

      {/* Taskbar */}
      <Taskbar
        activeWindow={activeWindow}
        onIconClick={(id) => setActiveWindow(id)}
        onHomeClick={onExit}
      />
    </div>
  );
};

export default Desktop;
