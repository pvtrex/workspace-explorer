import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

interface CharacterProps {
  scrollProgress: number;
  roomPosition?: [number, number, number];
}

const Character = ({ scrollProgress, roomPosition = [6, 0, 0] }: CharacterProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF('/models/character.glb');
  const { actions, names } = useAnimations(animations, groupRef);
  const [isWalking, setIsWalking] = useState(false);

  // Starting and ending positions relative to the room
  const startPosition = new THREE.Vector3(-1.5, 0, 1.5);
  const endPosition = new THREE.Vector3(1.2, 0, 0); // At the lounge chair

  // Character rotation to face the chair
  const startRotation = 0;
  const endRotation = -Math.PI / 4;

  // Play walk animation when scrolling
  useEffect(() => {
    console.log('[Character] Available animations:', names);
    
    // Try to find a walk animation
    const walkAnimName = names.find(name => 
      name.toLowerCase().includes('walk') || 
      name.toLowerCase().includes('run') ||
      name.toLowerCase().includes('move')
    );
    
    const idleAnimName = names.find(name =>
      name.toLowerCase().includes('idle') ||
      name.toLowerCase().includes('stand')
    );

    if (scrollProgress > 0.1 && scrollProgress < 0.9) {
      setIsWalking(true);
      if (walkAnimName && actions[walkAnimName]) {
        actions[walkAnimName].reset().fadeIn(0.3).play();
      }
    } else {
      setIsWalking(false);
      // Stop walk, play idle
      if (walkAnimName && actions[walkAnimName]) {
        actions[walkAnimName].fadeOut(0.3);
      }
      if (idleAnimName && actions[idleAnimName]) {
        actions[idleAnimName].reset().fadeIn(0.3).play();
      }
    }
  }, [scrollProgress > 0.1 && scrollProgress < 0.9, actions, names]);

  useFrame(() => {
    if (groupRef.current) {
      // Calculate position based on scroll progress
      // Character starts moving at 10% scroll and reaches destination at 80%
      const moveProgress = Math.max(0, Math.min(1, (scrollProgress - 0.1) / 0.7));
      
      // Smooth easing
      const easedProgress = 1 - Math.pow(1 - moveProgress, 3);
      
      // Interpolate position
      const currentX = startPosition.x + (endPosition.x - startPosition.x) * easedProgress;
      const currentZ = startPosition.z + (endPosition.z - startPosition.z) * easedProgress;
      
      // Add room offset
      groupRef.current.position.set(
        roomPosition[0] + currentX,
        roomPosition[1],
        roomPosition[2] + currentZ
      );
      
      // Interpolate rotation
      const currentRotation = startRotation + (endRotation - startRotation) * easedProgress;
      groupRef.current.rotation.y = currentRotation;
      
      // Slight bobbing while walking
      if (isWalking && moveProgress > 0 && moveProgress < 1) {
        groupRef.current.position.y = Math.sin(Date.now() * 0.01) * 0.02;
      } else {
        groupRef.current.position.y = 0;
      }
      
      // Sitting animation at the end
      if (moveProgress >= 0.95) {
        // Lower the character slightly to simulate sitting
        groupRef.current.position.y = -0.15;
      }
    }
  });

  return (
    <group ref={groupRef} scale={[0.5, 0.5, 0.5]}>
      <primitive object={scene} />
    </group>
  );
};

// Preload the model
useGLTF.preload('/models/character.glb');

export default Character;
