import { LucideIcon } from 'lucide-react';

interface DesktopIconProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  color?: string;
}

const DesktopIcon = ({ icon: Icon, label, onClick, isActive, color = 'text-primary' }: DesktopIconProps) => {
  return (
    <button
      onClick={onClick}
      className={`group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all duration-200 
        ${isActive ? 'bg-primary/20 ring-1 ring-primary/30' : 'hover:bg-primary/10'}
        active:scale-95`}
    >
      {/* Icon Container with glow effect */}
      <div className={`relative w-12 h-12 flex items-center justify-center rounded-lg bg-secondary/50 
        border border-border/30 group-hover:border-primary/40 transition-all duration-200
        group-hover:shadow-[0_0_15px_rgba(0,212,255,0.3)] ${color}`}>
        <Icon size={28} strokeWidth={1.5} className="transition-transform duration-200 group-hover:scale-110" />
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      {/* Label with text shadow */}
      <span className="text-[11px] text-center text-foreground/90 font-medium max-w-[70px] truncate 
        drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] group-hover:text-primary transition-colors">
        {label}
      </span>
    </button>
  );
};

export default DesktopIcon;
