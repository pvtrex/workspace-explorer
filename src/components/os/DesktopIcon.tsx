import { LucideIcon } from 'lucide-react';

interface DesktopIconProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  isActive?: boolean;
}

const DesktopIcon = ({ icon: Icon, label, onClick, isActive }: DesktopIconProps) => {
  return (
    <button
      onClick={onClick}
      className={`desktop-icon group ${isActive ? 'bg-primary/20' : ''}`}
    >
      <div className="desktop-icon-image group-hover:scale-110 transition-transform duration-200">
        <Icon size={40} strokeWidth={1.5} />
      </div>
      <span className="desktop-icon-label">{label}</span>
    </button>
  );
};

export default DesktopIcon;
