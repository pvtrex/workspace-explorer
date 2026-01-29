import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

interface KeyState {
  [key: string]: boolean;
}

interface InteractiveKeyboardProps {
  isInteractive: boolean;
}

// Keyboard layout mapping - maps real keys to grid positions
const KEY_MAP: Record<string, { row: number; col: number }> = {
  // Row 0 - Number row
  '`': { row: 0, col: 0 }, '1': { row: 0, col: 1 }, '2': { row: 0, col: 2 }, '3': { row: 0, col: 3 },
  '4': { row: 0, col: 4 }, '5': { row: 0, col: 5 }, '6': { row: 0, col: 6 }, '7': { row: 0, col: 7 },
  '8': { row: 0, col: 8 }, '9': { row: 0, col: 9 }, '0': { row: 0, col: 10 },
  // Row 1 - QWERTY row
  'q': { row: 1, col: 0 }, 'w': { row: 1, col: 1 }, 'e': { row: 1, col: 2 }, 'r': { row: 1, col: 3 },
  't': { row: 1, col: 4 }, 'y': { row: 1, col: 5 }, 'u': { row: 1, col: 6 }, 'i': { row: 1, col: 7 },
  'o': { row: 1, col: 8 }, 'p': { row: 1, col: 9 },
  // Row 2 - ASDF row
  'a': { row: 2, col: 0 }, 's': { row: 2, col: 1 }, 'd': { row: 2, col: 2 }, 'f': { row: 2, col: 3 },
  'g': { row: 2, col: 4 }, 'h': { row: 2, col: 5 }, 'j': { row: 2, col: 6 }, 'k': { row: 2, col: 7 },
  'l': { row: 2, col: 8 }, ';': { row: 2, col: 9 },
  // Row 3 - ZXCV row
  'z': { row: 3, col: 0 }, 'x': { row: 3, col: 1 }, 'c': { row: 3, col: 2 }, 'v': { row: 3, col: 3 },
  'b': { row: 3, col: 4 }, 'n': { row: 3, col: 5 }, 'm': { row: 3, col: 6 }, ',': { row: 3, col: 7 },
  '.': { row: 3, col: 8 }, '/': { row: 3, col: 9 },
  // Special keys
  ' ': { row: 4, col: 4 }, // Spacebar approximation
  'enter': { row: 2, col: 9 },
  'shift': { row: 3, col: 0 },
  'control': { row: 4, col: 0 },
  'alt': { row: 4, col: 2 },
  'tab': { row: 1, col: 0 },
  'escape': { row: 0, col: 0 },
  'backspace': { row: 0, col: 9 },
};

const InteractiveKeyboard = ({ isInteractive }: InteractiveKeyboardProps) => {
  const [pressedKeys, setPressedKeys] = useState<KeyState>({});
  const keysRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const keyAnimations = useRef<Map<string, gsap.core.Tween>>(new Map());

  // Convert keyboard event to grid key
  const getGridKey = useCallback((e: KeyboardEvent): string | null => {
    const key = e.key.toLowerCase();
    const mapping = KEY_MAP[key];
    
    if (mapping) {
      return `${mapping.row}-${mapping.col}`;
    }
    
    // For unmapped keys, use a random visible key for visual feedback
    return `${Math.floor(Math.random() * 4)}-${Math.floor(Math.random() * 10)}`;
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isInteractive) return;
    
    const gridKey = getGridKey(e);
    if (!gridKey) return;
    
    // Cancel any existing animation for this key
    const existingAnim = keyAnimations.current.get(gridKey);
    if (existingAnim) {
      existingAnim.kill();
    }
    
    setPressedKeys(prev => ({ ...prev, [gridKey]: true }));
    
    // Get the mesh and animate with GSAP
    const mesh = keysRef.current.get(gridKey);
    if (mesh) {
      const anim = gsap.to(mesh.position, {
        y: 0.008,
        duration: 0.05,
        ease: 'power2.out',
      });
      keyAnimations.current.set(gridKey, anim);
    }
  }, [isInteractive, getGridKey]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (!isInteractive) return;
    
    const gridKey = getGridKey(e);
    if (!gridKey) return;
    
    // Cancel any existing animation for this key
    const existingAnim = keyAnimations.current.get(gridKey);
    if (existingAnim) {
      existingAnim.kill();
    }
    
    setPressedKeys(prev => {
      const newState = { ...prev };
      delete newState[gridKey];
      return newState;
    });
    
    // Get the mesh and animate back with GSAP spring effect
    const mesh = keysRef.current.get(gridKey);
    if (mesh) {
      const anim = gsap.to(mesh.position, {
        y: 0.015,
        duration: 0.15,
        ease: 'elastic.out(1.2, 0.4)',
      });
      keyAnimations.current.set(gridKey, anim);
    }
  }, [isInteractive, getGridKey]);

  useEffect(() => {
    if (isInteractive) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      // Clean up animations
      keyAnimations.current.forEach(anim => anim.kill());
      keyAnimations.current.clear();
    };
  }, [isInteractive, handleKeyDown, handleKeyUp]);

  // Memoized key material based on pressed state
  const getKeyMaterial = useCallback((isPressed: boolean) => ({
    color: isPressed ? '#00d4ff' : '#252530',
    metalness: 0.2,
    roughness: isPressed ? 0.4 : 0.65,
    emissive: isPressed ? '#00d4ff' : '#000000',
    emissiveIntensity: isPressed ? 0.5 : 0,
  }), []);

  return (
    <group position={[0.05, 0.63, 0.12]}>
      {/* Keyboard base - matte plastic with slight texture */}
      <mesh castShadow>
        <boxGeometry args={[0.38, 0.018, 0.13]} />
        <meshStandardMaterial 
          color="#18181f" 
          metalness={0.15} 
          roughness={0.75}
        />
      </mesh>
      {/* Palm rest area */}
      <mesh position={[0, 0.001, 0.055]} castShadow>
        <boxGeometry args={[0.36, 0.016, 0.025]} />
        <meshStandardMaterial 
          color="#1f1f28" 
          metalness={0.1} 
          roughness={0.85}
        />
      </mesh>
      {/* Keys */}
      {Array.from({ length: 4 }).map((_, row) =>
        Array.from({ length: 10 }).map((_, col) => {
          const key = `${row}-${col}`;
          const isPressed = pressedKeys[key];
          const matProps = getKeyMaterial(isPressed);
          
          return (
            <mesh
              key={key}
              ref={(el) => {
                if (el) keysRef.current.set(key, el);
              }}
              position={[-0.15 + col * 0.034, 0.015, -0.04 + row * 0.028]}
              castShadow
            >
              <boxGeometry args={[0.026, 0.007, 0.022]} />
              <meshStandardMaterial {...matProps} />
            </mesh>
          );
        })
      )}
      {/* LED indicator lights */}
      <mesh position={[0.16, 0.015, -0.05]}>
        <boxGeometry args={[0.004, 0.003, 0.004]} />
        <meshStandardMaterial 
          color="#00ff88" 
          emissive="#00ff88" 
          emissiveIntensity={0.8}
        />
      </mesh>
      {/* Caps lock LED */}
      <mesh position={[0.14, 0.015, -0.05]}>
        <boxGeometry args={[0.004, 0.003, 0.004]} />
        <meshStandardMaterial 
          color="#ff4444" 
          emissive="#ff4444" 
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
};

export default InteractiveKeyboard;
