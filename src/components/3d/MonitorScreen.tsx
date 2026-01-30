import { Html } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import Desktop from '../os/Desktop';

interface MonitorScreenProps {
  isActive: boolean;
  onExit: () => void;
}

const MonitorScreen = ({ isActive, onExit }: MonitorScreenProps) => {
  const htmlRef = useRef<THREE.Group>(null);
  const [isReady, setIsReady] = useState(false);
  const hasBooted = useRef(false);

  useEffect(() => {
    if (isActive && !hasBooted.current) {
      console.log('[MonitorScreen] Activating - starting boot timer');
      hasBooted.current = true;
      
      // Short delay to show boot screen
      const timer = setTimeout(() => {
        console.log('[MonitorScreen] Boot complete - showing Desktop');
        setIsReady(true);
      }, 400);
      
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  // Reset on deactivation
  useEffect(() => {
    if (!isActive) {
      hasBooted.current = false;
      setIsReady(false);
    }
  }, [isActive]);

  console.log('[MonitorScreen] Render:', { isActive, isReady });

  if (!isActive) {
    return null;
  }

  // Monitor screen dimensions from WorkspaceScene:
  // Monitor frame at position [0, 1.15, -0.3] with screen size ~1.0 x 0.56 units
  // Screen glass at z-offset +0.024, we position just in front at +0.08
  
  return (
    <group ref={htmlRef} position={[0, 1.15, -0.22]}>
      <Html
        transform
        distanceFactor={1}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        scale={[0.00098, 0.00098, 0.00098]}
        prepend
        center
        style={{
          width: '1024px',
          height: '576px',
          borderRadius: '4px',
          overflow: 'hidden',
          pointerEvents: 'auto',
          userSelect: 'none',
        }}
      >
        <div 
          style={{ 
            width: '1024px', 
            height: '576px',
            background: '#0a0a12',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {!isReady ? (
            // Boot screen
            <div 
              style={{ 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0a0a12 0%, #0d1020 50%, #0a0a12 100%)',
              }}
            >
              <div 
                style={{ 
                  color: '#00d4ff', 
                  fontFamily: 'monospace', 
                  fontSize: '32px', 
                  marginBottom: '32px',
                  letterSpacing: '4px',
                  textShadow: '0 0 20px rgba(0, 212, 255, 0.5)',
                }}
              >
                Portfolio OS
              </div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    style={{ 
                      width: '16px', 
                      height: '16px', 
                      borderRadius: '50%',
                      background: '#00d4ff',
                      boxShadow: '0 0 10px rgba(0, 212, 255, 0.5)',
                      animation: `pulse 1s infinite ${i * 150}ms`,
                    }}
                  />
                ))}
              </div>
              <div style={{ color: '#6b7280', fontFamily: 'monospace', fontSize: '16px' }}>
                Initializing workspace...
              </div>
              <style>{`
                @keyframes pulse {
                  0%, 100% { opacity: 0.3; transform: scale(0.8); }
                  50% { opacity: 1; transform: scale(1); }
                }
              `}</style>
            </div>
          ) : (
            <Desktop onExit={onExit} isEmbedded />
          )}
        </div>
      </Html>
    </group>
  );
};

export default MonitorScreen;
