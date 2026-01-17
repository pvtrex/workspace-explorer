import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Desk Component
const Desk = () => {
  return (
    <group position={[0, 0, 0]}>
      {/* Desktop surface */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.05, 1.2]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.3} roughness={0.7} />
      </mesh>
      {/* Left legs */}
      <mesh position={[-1.1, 0.375, 0.5]} castShadow>
        <boxGeometry args={[0.05, 0.75, 0.05]} />
        <meshStandardMaterial color="#0f0f1a" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[-1.1, 0.375, -0.5]} castShadow>
        <boxGeometry args={[0.05, 0.75, 0.05]} />
        <meshStandardMaterial color="#0f0f1a" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Right legs */}
      <mesh position={[1.1, 0.375, 0.5]} castShadow>
        <boxGeometry args={[0.05, 0.75, 0.05]} />
        <meshStandardMaterial color="#0f0f1a" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[1.1, 0.375, -0.5]} castShadow>
        <boxGeometry args={[0.05, 0.75, 0.05]} />
        <meshStandardMaterial color="#0f0f1a" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
};

// Monitor Component
const Monitor = ({ screenOn = false }: { screenOn?: boolean }) => {
  const screenRef = useRef<THREE.Mesh>(null);
  
  const screenMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: screenOn ? '#0a0a0f' : '#050508',
      emissive: screenOn ? '#00d4ff' : '#000000',
      emissiveIntensity: screenOn ? 0.1 : 0,
      metalness: 0.9,
      roughness: 0.1,
    });
  }, [screenOn]);

  useFrame((state) => {
    if (screenRef.current && screenOn) {
      screenMaterial.emissiveIntensity = 0.1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
  });

  return (
    <group position={[0, 1.15, -0.3]}>
      {/* Monitor frame */}
      <mesh castShadow>
        <boxGeometry args={[1.2, 0.7, 0.05]} />
        <meshStandardMaterial color="#0a0a0f" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Screen */}
      <mesh ref={screenRef} position={[0, 0, 0.026]} material={screenMaterial}>
        <boxGeometry args={[1.12, 0.62, 0.01]} />
      </mesh>
      {/* Stand neck */}
      <mesh position={[0, -0.4, 0.1]} castShadow>
        <boxGeometry args={[0.08, 0.15, 0.08]} />
        <meshStandardMaterial color="#0a0a0f" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Stand base */}
      <mesh position={[0, -0.48, 0.15]} castShadow>
        <boxGeometry args={[0.4, 0.02, 0.25]} />
        <meshStandardMaterial color="#0a0a0f" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
};

// Keyboard Component
const Keyboard = () => {
  return (
    <group position={[0, 0.78, 0.2]}>
      <mesh castShadow>
        <boxGeometry args={[0.45, 0.02, 0.15]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* Keys representation */}
      {Array.from({ length: 4 }).map((_, row) =>
        Array.from({ length: 10 }).map((_, col) => (
          <mesh
            key={`key-${row}-${col}`}
            position={[-0.18 + col * 0.04, 0.015, -0.05 + row * 0.035]}
            castShadow
          >
            <boxGeometry args={[0.03, 0.008, 0.025]} />
            <meshStandardMaterial color="#2a2a3e" metalness={0.3} roughness={0.7} />
          </mesh>
        ))
      )}
    </group>
  );
};

// Mouse Component
const Mouse = () => {
  return (
    <group position={[0.4, 0.78, 0.25]}>
      <mesh castShadow>
        <capsuleGeometry args={[0.025, 0.05, 8, 16]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.4} roughness={0.6} />
      </mesh>
    </group>
  );
};

// Chair Component
const Chair = () => {
  return (
    <group position={[0, 0, 1]}>
      {/* Seat */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.5, 0.08, 0.5]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.3} roughness={0.8} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.8, -0.22]} castShadow>
        <boxGeometry args={[0.48, 0.6, 0.08]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.3} roughness={0.8} />
      </mesh>
      {/* Center pole */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.4, 16]} />
        <meshStandardMaterial color="#0a0a0f" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Base star */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.sin((angle * Math.PI) / 180) * 0.25,
            0.05,
            Math.cos((angle * Math.PI) / 180) * 0.25,
          ]}
          rotation={[0, (angle * Math.PI) / 180, 0]}
          castShadow
        >
          <boxGeometry args={[0.04, 0.04, 0.3]} />
          <meshStandardMaterial color="#0a0a0f" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
      {/* Wheels */}
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <mesh
          key={`wheel-${i}`}
          position={[
            Math.sin((angle * Math.PI) / 180) * 0.35,
            0.03,
            Math.cos((angle * Math.PI) / 180) * 0.35,
          ]}
          castShadow
        >
          <sphereGeometry args={[0.03, 16, 16]} />
          <meshStandardMaterial color="#0a0a0f" metalness={0.9} roughness={0.1} />
        </mesh>
      ))}
    </group>
  );
};

// PC Tower Component
const PCTower = () => {
  return (
    <group position={[-1.4, 0.55, 0]}>
      <mesh castShadow>
        <boxGeometry args={[0.25, 0.5, 0.5]} />
        <meshStandardMaterial color="#0a0a0f" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* RGB strip */}
      <mesh position={[0.126, 0, 0]}>
        <boxGeometry args={[0.005, 0.45, 0.02]} />
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
};

// Floor Component
const Floor = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#0a0a12" metalness={0.1} roughness={0.9} />
    </mesh>
  );
};

// Main Workspace Scene
export const WorkspaceScene = ({ screenOn = false }: { screenOn?: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Subtle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      <Floor />
      <Desk />
      <Monitor screenOn={screenOn} />
      <Keyboard />
      <Mouse />
      <Chair />
      <PCTower />
    </group>
  );
};
