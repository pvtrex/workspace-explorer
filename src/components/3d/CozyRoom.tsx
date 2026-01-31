import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CozyRoomProps {
  scrollProgress?: number;
}

// Wall component
const Wall = ({ 
  position, 
  rotation, 
  size 
}: { 
  position: [number, number, number]; 
  rotation: [number, number, number]; 
  size: [number, number] 
}) => {
  return (
    <mesh position={position} rotation={rotation} receiveShadow>
      <planeGeometry args={size} />
      <meshStandardMaterial 
        color="#e8e4df" 
        roughness={0.9} 
        metalness={0.05}
      />
    </mesh>
  );
};

// Wooden floor
const WoodFloor = () => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[4, 4]} />
      <meshStandardMaterial 
        color="#8b6914" 
        roughness={0.7} 
        metalness={0.1}
      />
    </mesh>
  );
};

// Sofa component
const Sofa = ({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.4, 0.7]} />
        <meshStandardMaterial color="#3a5a40" roughness={0.85} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.5, -0.28]} castShadow>
        <boxGeometry args={[1.6, 0.5, 0.15]} />
        <meshStandardMaterial color="#3a5a40" roughness={0.85} />
      </mesh>
      {/* Left armrest */}
      <mesh position={[-0.72, 0.35, 0]} castShadow>
        <boxGeometry args={[0.15, 0.3, 0.7]} />
        <meshStandardMaterial color="#344e41" roughness={0.85} />
      </mesh>
      {/* Right armrest */}
      <mesh position={[0.72, 0.35, 0]} castShadow>
        <boxGeometry args={[0.15, 0.3, 0.7]} />
        <meshStandardMaterial color="#344e41" roughness={0.85} />
      </mesh>
      {/* Cushions */}
      <mesh position={[-0.35, 0.45, 0.05]} castShadow>
        <boxGeometry args={[0.55, 0.12, 0.5]} />
        <meshStandardMaterial color="#588157" roughness={0.9} />
      </mesh>
      <mesh position={[0.35, 0.45, 0.05]} castShadow>
        <boxGeometry args={[0.55, 0.12, 0.5]} />
        <meshStandardMaterial color="#588157" roughness={0.9} />
      </mesh>
      {/* Back cushions */}
      <mesh position={[-0.35, 0.55, -0.2]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.45, 0.35, 0.1]} />
        <meshStandardMaterial color="#a3b18a" roughness={0.9} />
      </mesh>
      <mesh position={[0.35, 0.55, -0.2]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.45, 0.35, 0.1]} />
        <meshStandardMaterial color="#a3b18a" roughness={0.9} />
      </mesh>
      {/* Legs */}
      {[[-0.65, 0, 0.25], [0.65, 0, 0.25], [-0.65, 0, -0.25], [0.65, 0, -0.25]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.1, 8]} />
          <meshStandardMaterial color="#2d2d2d" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
};

// Chair component (for character to sit on)
const LoungeChair = ({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Seat */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.08, 0.5]} />
        <meshStandardMaterial color="#d4a574" roughness={0.8} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.6, -0.22]} castShadow>
        <boxGeometry args={[0.5, 0.5, 0.06]} />
        <meshStandardMaterial color="#d4a574" roughness={0.8} />
      </mesh>
      {/* Legs */}
      {[[-0.2, 0.15, 0.2], [0.2, 0.15, 0.2], [-0.2, 0.15, -0.2], [0.2, 0.15, -0.2]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.04, 0.3, 0.04]} />
          <meshStandardMaterial color="#5c4033" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
};

// Coffee table
const CoffeeTable = ({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      {/* Table top */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.04, 0.5]} />
        <meshStandardMaterial color="#5c4033" roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Legs */}
      {[[-0.35, 0.15, 0.2], [0.35, 0.15, 0.2], [-0.35, 0.15, -0.2], [0.35, 0.15, -0.2]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.04, 0.3, 0.04]} />
          <meshStandardMaterial color="#3d2b1f" roughness={0.7} />
        </mesh>
      ))}
      {/* Books on table */}
      <mesh position={[0.15, 0.42, 0]} rotation={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.2, 0.04, 0.15]} />
        <meshStandardMaterial color="#8b4513" roughness={0.9} />
      </mesh>
      <mesh position={[0.12, 0.46, -0.02]} rotation={[0, -0.1, 0]} castShadow>
        <boxGeometry args={[0.18, 0.03, 0.13]} />
        <meshStandardMaterial color="#2f4f4f" roughness={0.9} />
      </mesh>
    </group>
  );
};

// Table lamp
const TableLamp = ({ position }: { position: [number, number, number] }) => {
  const lightRef = useRef<THREE.PointLight>(null);
  
  useFrame((state) => {
    if (lightRef.current) {
      // Subtle flicker effect
      lightRef.current.intensity = 1.5 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.04, 16]} />
        <meshStandardMaterial color="#2d2d2d" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Pole */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.35, 8]} />
        <meshStandardMaterial color="#b8860b" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Lampshade */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 0.15, 16]} />
        <meshStandardMaterial 
          color="#f5e6d3" 
          roughness={0.95} 
          transparent 
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Light */}
      <pointLight 
        ref={lightRef}
        position={[0, 0.35, 0]} 
        intensity={1.5} 
        color="#ffcc88" 
        distance={3} 
        decay={2}
        castShadow
      />
    </group>
  );
};

// Side table for lamp
const SideTable = ({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.18, 0.04, 16]} />
        <meshStandardMaterial color="#5c4033" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.14, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.06, 0.28, 8]} />
        <meshStandardMaterial color="#3d2b1f" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.02, 16]} />
        <meshStandardMaterial color="#5c4033" roughness={0.6} />
      </mesh>
    </group>
  );
};

// Bookshelf
const Bookshelf = ({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) => {
  const bookColors = ['#8b4513', '#2f4f4f', '#800020', '#1e3a5f', '#556b2f', '#4a4a4a', '#8b0000'];
  
  return (
    <group position={position} rotation={rotation}>
      {/* Frame */}
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 1.8, 0.25]} />
        <meshStandardMaterial color="#3d2b1f" roughness={0.8} />
      </mesh>
      {/* Shelves */}
      {[0.2, 0.6, 1.0, 1.4].map((y, i) => (
        <mesh key={i} position={[0, y, 0.02]} castShadow>
          <boxGeometry args={[0.75, 0.03, 0.22]} />
          <meshStandardMaterial color="#5c4033" roughness={0.7} />
        </mesh>
      ))}
      {/* Books */}
      {[0.2, 0.6, 1.0, 1.4].map((y, shelfIndex) => (
        <group key={shelfIndex}>
          {Array.from({ length: 5 + Math.floor(Math.random() * 3) }).map((_, bookIndex) => (
            <mesh 
              key={bookIndex} 
              position={[-0.3 + bookIndex * 0.12, y + 0.12, 0.02]} 
              castShadow
            >
              <boxGeometry args={[0.08, 0.18 + Math.random() * 0.05, 0.15]} />
              <meshStandardMaterial 
                color={bookColors[(shelfIndex + bookIndex) % bookColors.length]} 
                roughness={0.9} 
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};

// Flower pot
const FlowerPot = ({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      {/* Pot */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.08, 0.2, 16]} />
        <meshStandardMaterial color="#8b4513" roughness={0.85} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.19, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.02, 16]} />
        <meshStandardMaterial color="#3d2b1f" roughness={1} />
      </mesh>
      {/* Plant leaves */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <mesh 
          key={i} 
          position={[
            Math.sin((angle * Math.PI) / 180) * 0.05,
            0.35,
            Math.cos((angle * Math.PI) / 180) * 0.05
          ]}
          rotation={[
            (Math.random() - 0.5) * 0.5,
            (angle * Math.PI) / 180,
            0.3 + Math.random() * 0.2
          ]}
          castShadow
        >
          <planeGeometry args={[0.08, 0.25]} />
          <meshStandardMaterial 
            color="#228b22" 
            roughness={0.9} 
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

// Rug
const Rug = ({ position }: { position: [number, number, number] }) => {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[2, 1.5]} />
      <meshStandardMaterial color="#8b7355" roughness={0.95} />
    </mesh>
  );
};

// Main Room Component
const CozyRoom = ({ scrollProgress = 0 }: CozyRoomProps) => {
  const roomRef = useRef<THREE.Group>(null);

  // Room is positioned to the right of the main workspace, slightly behind
  // Position: [4.5, 0, -3] puts it visible when user looks right
  return (
    <group ref={roomRef} position={[4.5, 0, -3]}>
      {/* Floor */}
      <WoodFloor />
      
      {/* Walls - 4x4 room, no roof */}
      <Wall position={[0, 1.5, -2]} rotation={[0, 0, 0]} size={[4, 3]} />
      <Wall position={[0, 1.5, 2]} rotation={[0, Math.PI, 0]} size={[4, 3]} />
      <Wall position={[-2, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} size={[4, 3]} />
      <Wall position={[2, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]} size={[4, 3]} />
      
      {/* Furniture */}
      <Sofa position={[0, 0, -1.3]} />
      <LoungeChair position={[1.2, 0, 0]} rotation={[0, -Math.PI / 4, 0]} />
      <LoungeChair position={[-1.2, 0, 0]} rotation={[0, Math.PI / 4, 0]} />
      <CoffeeTable position={[0, 0, 0]} />
      
      {/* Side tables with lamps */}
      <SideTable position={[1.5, 0, -1.3]} />
      <TableLamp position={[1.5, 0.32, -1.3]} />
      
      {/* Bookshelves */}
      <Bookshelf position={[-1.55, 0, -1.5]} rotation={[0, Math.PI / 2, 0]} />
      
      {/* Flower pots in corners */}
      <FlowerPot position={[-1.7, 0, 1.7]} />
      <FlowerPot position={[1.7, 0, 1.7]} />
      <FlowerPot position={[-1.7, 0, -1.7]} />
      <FlowerPot position={[1.7, 0, -1.7]} />
      
      {/* Rug */}
      <Rug position={[0, 0.01, 0]} />
      
      {/* Ambient room lighting */}
      <ambientLight intensity={0.25} color="#fff5e6" />
      <pointLight position={[0, 2.8, 0]} intensity={0.6} color="#fff8f0" distance={6} decay={2} />
    </group>
  );
};

export default CozyRoom;
