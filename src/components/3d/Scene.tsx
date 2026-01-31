import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { WorkspaceScene } from './WorkspaceScene';
import MonitorScreen from './MonitorScreen';
import CozyRoom from './CozyRoom';
import Character from './Character';
import * as THREE from 'three';
import gsap from 'gsap';

interface CameraControllerProps {
  targetPosition: [number, number, number];
  targetLookAt: [number, number, number];
  isAnimating: boolean;
  mousePosition: { x: number; y: number };
  enableMouseParallax: boolean;
  minZ: number;
}

const CameraController = ({ 
  targetPosition, 
  targetLookAt, 
  isAnimating, 
  mousePosition,
  enableMouseParallax,
  minZ
}: CameraControllerProps) => {
  const { camera } = useThree();
  const lookAtTarget = useRef(new THREE.Vector3(0, 1, 0));
  const basePosition = useRef(new THREE.Vector3(...targetPosition));

  useEffect(() => {
    // Clamp the Z position to never go closer than minZ
    const clampedZ = Math.max(targetPosition[2], minZ);
    const clampedPosition: [number, number, number] = [
      targetPosition[0],
      targetPosition[1],
      clampedZ
    ];
    
    basePosition.current.set(...clampedPosition);
    if (isAnimating) {
      gsap.to(camera.position, {
        x: clampedPosition[0],
        y: clampedPosition[1],
        z: clampedPosition[2],
        duration: 2,
        ease: 'power2.inOut',
      });
      gsap.to(lookAtTarget.current, {
        x: targetLookAt[0],
        y: targetLookAt[1],
        z: targetLookAt[2],
        duration: 2,
        ease: 'power2.inOut',
      });
    }
  }, [targetPosition, targetLookAt, isAnimating, camera, minZ]);

  useFrame(() => {
    // Add subtle mouse parallax when enabled
    if (enableMouseParallax) {
      const parallaxX = mousePosition.x * 0.15;
      const parallaxY = mousePosition.y * 0.08;
      
      camera.position.x = basePosition.current.x + parallaxX;
      camera.position.y = basePosition.current.y + parallaxY;
    }
    camera.lookAt(lookAtTarget.current);
  });

  return null;
};

const Lights = () => {
  return (
    <>
      {/* Ambient - slightly higher for visibility */}
      <ambientLight intensity={0.15} color="#1a1a3e" />
      
      {/* Key Light - Main directional, brighter and warmer */}
      <directionalLight
        position={[4, 7, 5]}
        intensity={1.0}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={20}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.0001}
        color="#fff8f0"
      />
      
      {/* Fill Light - Stronger to reduce harsh shadows */}
      <directionalLight
        position={[-4, 5, 3]}
        intensity={0.4}
        color="#e0e8ff"
      />
      
      {/* Rim Light - Enhanced for better depth separation */}
      <directionalLight
        position={[0, 4, -5]}
        intensity={0.5}
        color="#6080ff"
      />
      
      {/* Secondary rim from side */}
      <directionalLight
        position={[-3, 2, -3]}
        intensity={0.25}
        color="#8060ff"
      />
      
      {/* Accent lights - Cyan workspace glow */}
      <pointLight position={[-1.5, 2.5, 1.5]} intensity={0.3} color="#00d4ff" distance={5} decay={2} />
      <pointLight position={[2, 2, 0]} intensity={0.15} color="#a855f7" distance={4} decay={2} />
      
      {/* Monitor glow - stronger when visible */}
      <pointLight position={[0, 1.3, 0.3]} intensity={0.25} color="#00d4ff" distance={2.5} decay={2} />
      
      {/* Under-desk accent */}
      <pointLight position={[0, 0.2, 0.5]} intensity={0.1} color="#00d4ff" distance={2} decay={2} />
      
      {/* Main spotlight on workspace - brighter */}
      <spotLight
        position={[0, 5, 2]}
        angle={0.5}
        penumbra={0.7}
        intensity={0.8}
        castShadow
        shadow-bias={-0.0001}
        color="#fff8f0"
        target-position={[0, 0.8, 0]}
      />
      
      {/* Secondary spot for monitor area */}
      <spotLight
        position={[0, 3, -1]}
        angle={0.4}
        penumbra={0.8}
        intensity={0.3}
        color="#e0f0ff"
        target-position={[0, 1.2, -0.3]}
      />
    </>
  );
};

interface SceneProps {
  cameraPosition?: [number, number, number];
  cameraLookAt?: [number, number, number];
  isAnimating?: boolean;
  screenOn?: boolean;
  enableMouseParallax?: boolean;
  showDesktop?: boolean;
  onExitDesktop?: () => void;
  scrollProgress?: number;
}

const Scene = ({
  cameraPosition = [3.5, 2.2, 4.5],
  cameraLookAt = [0, 1.1, 0],
  isAnimating = false,
  screenOn = false,
  enableMouseParallax = true,
  showDesktop = false,
  onExitDesktop = () => {},
  scrollProgress = 0,
}: SceneProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position to -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Minimum Z distance - camera will never go closer than this
  const MIN_CAMERA_Z = 1.3;

  return (
    <Canvas
      shadows
      camera={{ position: cameraPosition, fov: 50 }}
      className="w-full h-full"
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <CameraController
          targetPosition={cameraPosition}
          targetLookAt={cameraLookAt}
          isAnimating={isAnimating}
          mousePosition={mousePosition}
          enableMouseParallax={enableMouseParallax && !isAnimating}
          minZ={MIN_CAMERA_Z}
        />
        <Lights />
        <WorkspaceScene 
          screenOn={screenOn} 
          mousePosition={mousePosition}
          isInteractive={showDesktop}
        />
        {/* Monitor screen with embedded Desktop UI */}
        <MonitorScreen 
          isActive={showDesktop} 
          onExit={onExitDesktop} 
        />
        
        {/* Cozy room environment - positioned to the right of workspace, visible when scrolling */}
        <CozyRoom scrollProgress={scrollProgress} />
        
        {/* Character with scroll-driven animation - in the cozy room */}
        <Character scrollProgress={scrollProgress} roomPosition={[4.5, 0, -3]} />
        
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.5}
          scale={15}
          blur={2}
          far={4}
        />
        <Environment preset="night" />
        {/* Lighter fog for better visibility */}
        <fog attach="fog" args={['#080812', 8, 25]} />
      </Suspense>
    </Canvas>
  );
};

export default Scene;
