import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import InteractiveMouse from './InteractiveMouse';
import InteractiveKeyboard from './InteractiveKeyboard';

interface WorkspaceSceneProps {
  screenOn?: boolean;
  mousePosition?: { x: number; y: number };
  isInteractive?: boolean;
}

// Desk Component - Realistic proportions with wood material
const Desk = () => {
  return (
    <group position={[0, 0, 0]} scale={[0.85, 0.85, 0.85]}>
      {/* Desktop surface - Dark wood laminate */}
      <mesh position={[0, 0.72, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.04, 0.9]} />
        <meshStandardMaterial 
          color="#2a1f1a" 
          metalness={0.1} 
          roughness={0.75}
        />
      </mesh>
      {/* Wood grain overlay effect */}
      <mesh position={[0, 0.741, 0]} receiveShadow>
        <boxGeometry args={[1.79, 0.002, 0.89]} />
        <meshStandardMaterial 
          color="#3d2b24" 
          metalness={0.05} 
          roughness={0.85}
          transparent
          opacity={0.4}
        />
      </mesh>
      {/* Left legs - Metal frame */}
      <mesh position={[-0.85, 0.36, 0.4]} castShadow>
        <boxGeometry args={[0.04, 0.72, 0.04]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-0.85, 0.36, -0.4]} castShadow>
        <boxGeometry args={[0.04, 0.72, 0.04]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Right legs */}
      <mesh position={[0.85, 0.36, 0.4]} castShadow>
        <boxGeometry args={[0.04, 0.72, 0.04]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.85, 0.36, -0.4]} castShadow>
        <boxGeometry args={[0.04, 0.72, 0.04]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Cross bar for stability */}
      <mesh position={[0, 0.15, -0.4]} castShadow>
        <boxGeometry args={[1.66, 0.03, 0.03]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
};

// Monitor Frame Component (screen content handled separately)
const MonitorFrame = ({ screenOn = false }: { screenOn?: boolean }) => {
  const screenRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  const screenMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: screenOn ? '#080810' : '#030305',
      emissive: screenOn ? '#00d4ff' : '#000000',
      emissiveIntensity: screenOn ? 0.15 : 0,
      metalness: 0.95,
      roughness: 0.05,
    });
  }, [screenOn]);

  useFrame((state) => {
    if (screenRef.current && screenOn) {
      screenMaterial.emissiveIntensity = 0.15 + Math.sin(state.clock.elapsedTime * 2) * 0.03;
    }
    // Subtle glow pulse when screen is on
    if (glowRef.current && screenOn) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.15 + Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
    }
  });

  return (
    <group position={[0, 1.15, -0.3]}>
      {/* Monitor bezel - dark plastic with slight sheen */}
      <mesh castShadow>
        <boxGeometry args={[1.1, 0.65, 0.045]} />
        <meshStandardMaterial 
          color="#0f0f12" 
          metalness={0.4} 
          roughness={0.35}
        />
      </mesh>
      {/* Screen glass layer */}
      <mesh position={[0, 0, 0.024]}>
        <boxGeometry args={[1.02, 0.58, 0.003]} />
        <meshStandardMaterial 
          color="#000005"
          metalness={0.98}
          roughness={0.02}
          transparent
          opacity={0.92}
        />
      </mesh>
      {/* Screen backing (visible when no HTML overlay) */}
      <mesh ref={screenRef} position={[0, 0, 0.022]} material={screenMaterial}>
        <boxGeometry args={[1.0, 0.56, 0.005]} />
      </mesh>
      {/* Screen glow effect when on */}
      {screenOn && (
        <mesh ref={glowRef} position={[0, 0, 0.03]}>
          <planeGeometry args={[1.1, 0.65]} />
          <meshBasicMaterial 
            color="#00d4ff"
            transparent
            opacity={0.15}
          />
        </mesh>
      )}
      {/* Stand neck - metal */}
      <mesh position={[0, -0.38, 0.08]} castShadow>
        <boxGeometry args={[0.06, 0.12, 0.06]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.85} roughness={0.15} />
      </mesh>
      {/* Stand base - aluminum */}
      <mesh position={[0, -0.45, 0.12]} castShadow>
        <boxGeometry args={[0.35, 0.015, 0.2]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Power LED */}
      <mesh position={[0, -0.3, 0.025]}>
        <sphereGeometry args={[0.006, 8, 8]} />
        <meshStandardMaterial 
          color={screenOn ? "#00ff88" : "#333333"}
          emissive={screenOn ? "#00ff88" : "#000000"}
          emissiveIntensity={screenOn ? 2 : 0}
        />
      </mesh>
    </group>
  );
};

// Chair Component - Ergonomic gaming/office chair
const Chair = () => {
  return (
    <group position={[0, 0, 0.9]} scale={[0.9, 0.9, 0.9]}>
      {/* Seat cushion - leather-like */}
      <mesh position={[0, 0.42, 0]} castShadow>
        <boxGeometry args={[0.45, 0.06, 0.45]} />
        <meshStandardMaterial 
          color="#1a1a24" 
          metalness={0.1} 
          roughness={0.85}
        />
      </mesh>
      {/* Seat padding detail */}
      <mesh position={[0, 0.455, 0]}>
        <boxGeometry args={[0.42, 0.02, 0.42]} />
        <meshStandardMaterial color="#252530" metalness={0.05} roughness={0.9} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.72, -0.2]} castShadow>
        <boxGeometry args={[0.44, 0.5, 0.06]} />
        <meshStandardMaterial 
          color="#1a1a24" 
          metalness={0.1} 
          roughness={0.85}
        />
      </mesh>
      {/* Headrest */}
      <mesh position={[0, 1.0, -0.2]} castShadow>
        <boxGeometry args={[0.3, 0.12, 0.05]} />
        <meshStandardMaterial color="#1a1a24" metalness={0.1} roughness={0.85} />
      </mesh>
      {/* Armrests */}
      <mesh position={[-0.25, 0.55, 0]} castShadow>
        <boxGeometry args={[0.04, 0.04, 0.25]} />
        <meshStandardMaterial color="#0f0f15" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0.25, 0.55, 0]} castShadow>
        <boxGeometry args={[0.04, 0.04, 0.25]} />
        <meshStandardMaterial color="#0f0f15" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Center pole - chrome */}
      <mesh position={[0, 0.24, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.03, 0.35, 16]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.95} roughness={0.05} />
      </mesh>
      {/* Base star - metal */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.sin((angle * Math.PI) / 180) * 0.22,
            0.05,
            Math.cos((angle * Math.PI) / 180) * 0.22,
          ]}
          rotation={[0, (angle * Math.PI) / 180, 0]}
          castShadow
        >
          <boxGeometry args={[0.035, 0.035, 0.26]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.85} roughness={0.15} />
        </mesh>
      ))}
      {/* Wheels - rubber with chrome */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <group
          key={`wheel-${i}`}
          position={[
            Math.sin((angle * Math.PI) / 180) * 0.32,
            0.025,
            Math.cos((angle * Math.PI) / 180) * 0.32,
          ]}
        >
          <mesh castShadow>
            <sphereGeometry args={[0.025, 12, 12]} />
            <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

// PC Tower Component - Gaming PC with subtle RGB
const PCTower = () => {
  const stripRef = useRef<THREE.Mesh>(null);
  const fanGlowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (stripRef.current) {
      const material = stripRef.current.material as THREE.MeshStandardMaterial;
      // Subtle breathing RGB effect
      material.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    }
    if (fanGlowRef.current) {
      fanGlowRef.current.rotation.z += 0.02; // Spinning fan effect
    }
  });

  return (
    <group position={[-0.95, 0.5, -0.15]} scale={[0.85, 0.85, 0.85]}>
      {/* Main case body - brushed metal */}
      <mesh castShadow>
        <boxGeometry args={[0.2, 0.45, 0.4]} />
        <meshStandardMaterial 
          color="#0c0c0f" 
          metalness={0.6} 
          roughness={0.4}
        />
      </mesh>
      {/* Front panel - glass */}
      <mesh position={[0.101, 0, 0]}>
        <boxGeometry args={[0.003, 0.43, 0.38]} />
        <meshStandardMaterial 
          color="#0a0a12"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* RGB strip - vertical accent (tasteful, not overdone) */}
      <mesh ref={stripRef} position={[0.103, 0, 0.15]}>
        <boxGeometry args={[0.003, 0.4, 0.015]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Fan glow effect */}
      <mesh ref={fanGlowRef} position={[0.103, 0.1, 0]}>
        <ringGeometry args={[0.04, 0.06, 16]} />
        <meshBasicMaterial 
          color="#00d4ff"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Power LED */}
      <mesh position={[0.103, -0.18, 0.15]}>
        <sphereGeometry args={[0.005, 8, 8]} />
        <meshStandardMaterial
          color="#00ff88"
          emissive="#00ff88"
          emissiveIntensity={1.5}
        />
      </mesh>
      {/* Top exhaust vent lines */}
      {[-0.08, 0, 0.08].map((x, i) => (
        <mesh key={i} position={[x, 0.226, 0]}>
          <boxGeometry args={[0.04, 0.003, 0.3]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
};

// Floor Component - Dark polished concrete look
const Floor = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[15, 15]} />
      <meshStandardMaterial 
        color="#080810" 
        metalness={0.2} 
        roughness={0.85}
      />
    </mesh>
  );
};

// Main Workspace Scene
export const WorkspaceScene = ({ 
  screenOn = false, 
  mousePosition = { x: 0, y: 0 },
  isInteractive = false 
}: WorkspaceSceneProps) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      <Floor />
      <Desk />
      <MonitorFrame screenOn={screenOn} />
      <InteractiveKeyboard isInteractive={isInteractive} />
      <InteractiveMouse mousePosition={mousePosition} isInteractive={isInteractive} />
      <Chair />
      <PCTower />
    </group>
  );
};
