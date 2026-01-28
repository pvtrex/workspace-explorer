import { ReactNode, useState, useRef, useEffect, useCallback } from 'react';
import { X, Minus, Square, Maximize2 } from 'lucide-react';

interface WindowProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  isOpen: boolean;
}

const Window = ({ title, children, onClose, isOpen }: WindowProps) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  // Center window on open
  useEffect(() => {
    if (isOpen && !isMaximized) {
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, isMaximized]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMaximized) return;
    
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
    };
  }, [isMaximized, position]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragRef.current) return;
      
      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;
      
      setPosition({
        x: dragRef.current.initialX + deltaX,
        y: dragRef.current.initialY + deltaY,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragRef.current = null;
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const toggleMaximize = () => {
    if (!isMaximized) {
      setPosition({ x: 0, y: 0 });
    }
    setIsMaximized(!isMaximized);
  };

  if (!isOpen) return null;

  const windowStyle = isMaximized 
    ? { inset: '4px 4px 52px 4px' }
    : {
        top: `calc(50% + ${position.y}px)`,
        left: `calc(50% + ${position.x}px)`,
        transform: 'translate(-50%, -50%)',
        width: 'calc(100% - 80px)',
        height: 'calc(100% - 100px)',
        maxWidth: '900px',
        maxHeight: '600px',
      };

  return (
    <div 
      ref={windowRef}
      className={`absolute window-glass animate-window-open z-10 ${isDragging ? 'cursor-grabbing' : ''}`}
      style={windowStyle}
    >
      {/* Title bar */}
      <div 
        className={`window-titlebar ${!isMaximized ? 'cursor-grab' : ''} ${isDragging ? 'cursor-grabbing' : ''}`}
        onMouseDown={handleMouseDown}
        onDoubleClick={toggleMaximize}
      >
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary/20 flex items-center justify-center">
            <div className="w-2 h-2 rounded-sm bg-primary" />
          </div>
          <span className="text-sm font-medium text-foreground/90 select-none">{title}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            className="w-10 h-7 flex items-center justify-center hover:bg-foreground/10 transition-colors rounded-sm"
            title="Minimize"
          >
            <Minus size={14} className="text-foreground/70" />
          </button>
          <button 
            onClick={toggleMaximize}
            className="w-10 h-7 flex items-center justify-center hover:bg-foreground/10 transition-colors rounded-sm"
            title={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? (
              <Square size={12} className="text-foreground/70" />
            ) : (
              <Maximize2 size={12} className="text-foreground/70" />
            )}
          </button>
          <button
            onClick={onClose}
            className="w-10 h-7 flex items-center justify-center hover:bg-red-500 transition-colors rounded-sm group"
            title="Close"
          >
            <X size={14} className="text-foreground/70 group-hover:text-white" />
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="window-content p-6 overflow-y-auto" style={{ height: 'calc(100% - 40px)' }}>
        {children}
      </div>
    </div>
  );
};

export default Window;
