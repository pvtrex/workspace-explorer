import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LoadingScreen from '@/components/LoadingScreen';
import LandingSection from '@/components/LandingSection';

// Lazy load the 3D scene for better initial load
const Scene = lazy(() => import('@/components/3d/Scene'));

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showDesktop, setShowDesktop] = useState(false);
  const [showLandingText, setShowLandingText] = useState(true);
  const [introTextShown, setIntroTextShown] = useState(false); // One-time flag - never shows again
  const [animationComplete, setAnimationComplete] = useState(false); // Track when scroll animation is done
  const [cameraState, setCameraState] = useState<{
    position: [number, number, number];
    lookAt: [number, number, number];
  }>({
    position: [3, 2.5, 4],
    lookAt: [0, 1, 0],
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [screenOn, setScreenOn] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const desktopActivated = useRef(false); // Persistent flag - desktop stays on once activated
  const scrollProgress = useRef(0);

  useEffect(() => {
    if (!isLoading && containerRef.current) {
      const handleScroll = () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const progress = Math.min(scrollY / windowHeight, 1);
        scrollProgress.current = progress;

        // Phase 1: Hide landing text once user scrolls down (ONE-TIME, never comes back)
        if (progress > 0.15 && !introTextShown) {
          setIntroTextShown(true); // Mark as shown forever
          setShowLandingText(false);
        }

        // Phase 2: Zoom to monitor (25-60%)
        if (progress >= 0.25 && progress < 0.6) {
          const zoomProgress = (progress - 0.25) / 0.35;
          // Camera moves closer but stops at a minimum distance to keep scene visible
          const newPos: [number, number, number] = [
            3 - zoomProgress * 2.2,
            2.5 - zoomProgress * 1.0,
            4 - zoomProgress * 2.0,
          ];
          const newLookAt: [number, number, number] = [
            0,
            1.15 + zoomProgress * 0.05,
            0 - zoomProgress * 0.15,
          ];
          setCameraState({ position: newPos, lookAt: newLookAt });
          setIsAnimating(true);
        } else if (progress < 0.25 && !desktopActivated.current) {
          // Reset camera when scrolling back to top (only if desktop not yet activated)
          setCameraState({
            position: [3, 2.5, 4],
            lookAt: [0, 1, 0],
          });
          setIsAnimating(true);
        }

        // Phase 3: Animation complete detection (60%+)
        if (progress >= 0.6) {
          setAnimationComplete(true);
        }

        // Phase 4: Turn screen on (55%+) - PERMANENT once activated
        if (progress >= 0.55) {
          setScreenOn(true);
        } else if (progress < 0.2 && !desktopActivated.current) {
          // Only turn off if desktop was never activated
          setScreenOn(false);
        }

        // Phase 5: Show desktop UI inside monitor (70%+) - PERMANENT once shown
        if (progress >= 0.7) {
          desktopActivated.current = true; // Mark as permanently activated
          setShowDesktop(true);
        }
        // Desktop NEVER hides once activated - this is the main interaction surface
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isLoading, introTextShown]);

  const handleExitDesktop = () => {
    // Reset the activation flag so user can start fresh
    desktopActivated.current = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setCameraState({
        position: [3, 2.5, 4],
        lookAt: [0, 1, 0],
      });
      setScreenOn(false);
      setShowDesktop(false);
      setAnimationComplete(false);
      // Note: introTextShown stays true - intro text is ONE-TIME only
    }, 500);
  };

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Scroll container - creates scroll space */}
      <div className="h-[300vh]" />

      {/* Fixed viewport for 3D scene */}
      <div className="fixed inset-0">
        {/* 3D Scene with embedded Desktop */}
        <Suspense
          fallback={
            <div className="w-full h-full bg-background flex items-center justify-center">
              <div className="text-primary animate-pulse font-mono">
                Loading 3D Scene...
              </div>
            </div>
          }
        >
          <Scene
            cameraPosition={cameraState.position}
            cameraLookAt={cameraState.lookAt}
            isAnimating={isAnimating}
            screenOn={screenOn}
            enableMouseParallax={!showDesktop}
            showDesktop={showDesktop}
            onExitDesktop={handleExitDesktop}
          />
        </Suspense>

        {/* Landing text overlay */}
        <LandingSection isVisible={showLandingText} />

        {/* Scroll indicator */}
        {showLandingText && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
            <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center pt-2">
              <div className="w-1 h-2 bg-primary rounded-full animate-pulse" />
            </div>
            <span className="text-xs text-muted-foreground font-mono">Scroll</span>
          </div>
        )}

        {/* Progress indicator */}
        <div className="absolute bottom-4 right-4 text-xs font-mono text-muted-foreground">
          {screenOn && !showDesktop && (
            <span className="text-primary">Keep scrolling to enter workspace...</span>
          )}
        </div>

        {/* Exit hint when desktop is active */}
        {showDesktop && (
          <div className="absolute top-4 left-4 z-50">
            <button
              onClick={handleExitDesktop}
              className="px-3 py-1.5 text-xs font-mono bg-background/80 backdrop-blur-sm border border-primary/30 rounded text-primary hover:bg-primary/10 transition-colors"
            >
              ← Scroll up to exit
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
