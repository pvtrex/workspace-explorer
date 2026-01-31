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

  // Monitor frame is at [0, 1.15, -0.3] with screen size ~1.0 x 0.56 (16:9 aspect)
  // The Html component needs careful tuning: smaller distanceFactor = larger UI
  return (
    <group ref={htmlRef} position={[0, 1.15, -0.26]}>
      {/* Black backing plane - matches monitor screen size */}
      <mesh position={[0, 0, -0.005]}>
        <planeGeometry args={[1.0, 0.56]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      
      {/* Subtle screen glow when active */}
      <mesh position={[0, 0, -0.006]}>
        <planeGeometry args={[1.04, 0.60]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.1} />
      </mesh>
      
      <Html
        transform
        distanceFactor={0.112}
        position={[0, 0, 0.001]}
        rotation={[0, 0, 0]}
        zIndexRange={[100, 0]}
        occlude={false}
        style={{
          width: '1920px',
          height: '1080px',
          overflow: 'hidden',
          pointerEvents: 'auto',
          userSelect: 'none',
        }}
      >
        <div 
          style={{ 
            width: '1920px', 
            height: '1080px',
            background: '#0a0a12',
            display: 'flex',
            flexDirection: 'column',
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
                background: 'linear-gradient(135deg, #0a0a12 0%, #1a1a2e 50%, #0a0a12 100%)',
              }}
            >
              <div 
                style={{ 
                  color: '#00d4ff', 
                  fontFamily: 'monospace', 
                  fontSize: '72px', 
                  marginBottom: '48px',
                  letterSpacing: '8px',
                  textShadow: '0 0 40px rgba(0, 212, 255, 0.6)',
                  fontWeight: 'bold',
                }}
              >
                Portfolio OS
              </div>
              <div style={{ display: 'flex', gap: '20px', marginBottom: '48px' }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    style={{ 
                      width: '28px', 
                      height: '28px', 
                      borderRadius: '50%',
                      background: '#00d4ff',
                      boxShadow: '0 0 24px rgba(0, 212, 255, 0.8)',
                      animation: `pulse 1.2s ease-in-out infinite ${i * 150}ms`,
                    }}
                  />
                ))}
              </div>
              <div style={{ color: '#8b8b9e', fontFamily: 'monospace', fontSize: '32px' }}>
                Initializing workspace...
              </div>
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
