import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { WorkspaceScene } from './WorkspaceScene';
import * as THREE from 'three';
import gsap from 'gsap';

interface CameraControllerProps {
  targetPosition: [number, number, number];
  targetLookAt: [number, number, number];
  isAnimating: boolean;
}

const CameraController = ({ targetPosition, targetLookAt, isAnimating }: CameraControllerProps) => {
  const { camera } = useThree();
  const lookAtTarget = useRef(new THREE.Vector3(0, 1, 0));

  useEffect(() => {
    if (isAnimating) {
      gsap.to(camera.position, {
        x: targetPosition[0],
        y: targetPosition[1],
        z: targetPosition[2],
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
  }, [targetPosition, targetLookAt, isAnimating, camera]);

  useFrame(() => {
    camera.lookAt(lookAtTarget.current);
  });

  return null;
};

const Lights = () => {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={0.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-2, 3, 2]} intensity={0.3} color="#00d4ff" />
      <pointLight position={[2, 2, -1]} intensity={0.2} color="#a855f7" />
      <spotLight
        position={[0, 4, 0]}
        angle={0.5}
        penumbra={1}
        intensity={0.4}
        castShadow
      />
    </>
  );
};

interface SceneProps {
  cameraPosition?: [number, number, number];
  cameraLookAt?: [number, number, number];
  isAnimating?: boolean;
  screenOn?: boolean;
}

const Scene = ({
  cameraPosition = [3, 2.5, 4],
  cameraLookAt = [0, 1, 0],
  isAnimating = false,
  screenOn = false,
}: SceneProps) => {
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
        />
        <Lights />
        <WorkspaceScene screenOn={screenOn} />
        <ContactShadows
          position={[0, 0, 0]}
          opacity={0.5}
          scale={10}
          blur={2}
          far={4}
        />
        <Environment preset="night" />
        <fog attach="fog" args={['#0a0a12', 5, 20]} />
      </Suspense>
    </Canvas>
  );
};

export default Scene;
