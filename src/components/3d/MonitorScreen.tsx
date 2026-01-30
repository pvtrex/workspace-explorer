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
  // Screen glass at z-offset +0.024, so we place our dedicated plane slightly in front to avoid z-fighting.
  
  return (
    <group ref={htmlRef} position={[0, 1.15, -0.266]}>
      {/* Dedicated screen plane exactly matching the monitor's visible screen */}
      <mesh position={[0, 0, 0]} renderOrder={999}>
        <planeGeometry args={[1.0, 0.56]} />
        <meshBasicMaterial transparent opacity={0} depthTest={false} depthWrite={false} />
      </mesh>

      <Html
        transform
        occlude={false}
        zIndexRange={[1000, 0]}
        position={[0, 0, 0.001]}
        rotation={[0, 0, 0]}
        // Tune scale so 1024px ~= 1.0 world units (slightly oversized for readability)
        scale={[0.00105, 0.00105, 0.00105]}
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
            // Boot screen (high contrast for debug visibility)
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#0b2cff',
              }}
            >
              <div
                style={{
                  color: '#ffffff',
                  fontFamily: 'monospace',
                  fontSize: '44px',
                  marginBottom: '18px',
                  letterSpacing: '3px',
                }}
              >
                DESKTOP LOADING
              </div>
              <div style={{ color: '#ffffff', fontFamily: 'monospace', fontSize: '16px', opacity: 0.9 }}>
                (debug mode: ensuring fullscreen visibility)
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
