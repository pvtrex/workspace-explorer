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
  const [introTextShown, setIntroTextShown] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [cameraState, setCameraState] = useState<{
    position: [number, number, number];
    lookAt: [number, number, number];
  }>({
    position: [4, 2.8, 5],
    lookAt: [0, 1, 0],
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [screenOn, setScreenOn] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const desktopActivatedRef = useRef(false);

  useEffect(() => {
    if (!isLoading && containerRef.current) {
      const handleScroll = () => {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        // Calculate progress based on total scrollable distance
        const progress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;
        
        // Update scroll progress for room/character animation
        setScrollProgress(progress);

        console.log('[Scroll] Progress:', progress.toFixed(2), 'ScrollY:', scrollY, 'MaxScroll:', maxScroll);

        // Phase 1: Hide landing text once user scrolls down (ONE-TIME)
        if (progress > 0.1 && !introTextShown) {
          setIntroTextShown(true);
          setShowLandingText(false);
          console.log('[Scroll] Landing text hidden (one-time)');
        }

        // Phase 2: Zoom to monitor (15-50%) - more dramatic close-up, slightly right of center
        if (progress >= 0.15 && progress < 0.5) {
          const zoomProgress = (progress - 0.15) / 0.35;
          // Start: [4, 2.8, 5] -> End: [0.6, 1.4, 1.8] (closer and slightly right)
          const newPos: [number, number, number] = [
            4 - zoomProgress * 3.4,  // Move from 4 to 0.6 (slightly right of center)
            2.8 - zoomProgress * 1.4, // Move from 2.8 to 1.4 (eye level)
            5 - zoomProgress * 3.2,   // Move from 5 to 1.8 (much closer)
          ];
          const newLookAt: [number, number, number] = [
            0 + zoomProgress * 0.1,   // Slight offset to the right
            1.15 + zoomProgress * 0.05,
            -0.3 - zoomProgress * 0.1,
          ];
          setCameraState({ position: newPos, lookAt: newLookAt });
          setIsAnimating(true);
        } else if (progress < 0.15 && !desktopActivatedRef.current) {
          setCameraState({
            position: [4, 2.8, 5],
            lookAt: [0, 1, 0],
          });
          setIsAnimating(true);
        }

        // Phase 3: Turn screen on (40%+)
        if (progress >= 0.4) {
          if (!screenOn) {
            console.log('[Scroll] Screen turning ON');
            setScreenOn(true);
          }
        } else if (progress < 0.15 && !desktopActivatedRef.current) {
          setScreenOn(false);
        }

        // Phase 4: Show desktop UI inside monitor (55%+) - PERMANENT
        if (progress >= 0.55 && !desktopActivatedRef.current) {
          console.log('[Scroll] ACTIVATING DESKTOP - Animation complete!');
          desktopActivatedRef.current = true;
          setShowDesktop(true);
        }
      };

      // Initial call to set state based on current scroll position
      handleScroll();

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isLoading, introTextShown, screenOn]);

  const handleExitDesktop = () => {
    console.log('[Exit] Resetting to initial state');
    desktopActivatedRef.current = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setCameraState({
        position: [4, 2.8, 5],
        lookAt: [0, 1, 0],
      });
      setScreenOn(false);
      setShowDesktop(false);
    }, 500);
  };

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Scroll container - creates scroll space */}
      <div className="h-[250vh]" />

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
            scrollProgress={scrollProgress}
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

        {/* Progress indicator - debug info */}
        <div className="absolute bottom-4 right-4 text-xs font-mono text-muted-foreground space-y-1">
          {screenOn && !showDesktop && (
            <span className="text-primary block">Keep scrolling to enter workspace...</span>
          )}
          {showDesktop && (
            <span className="text-primary block">✓ Desktop Active</span>
          )}
        </div>

        {/* Exit hint when desktop is active */}
        {showDesktop && (
          <div className="absolute top-4 left-4 z-50">
            <button
              onClick={handleExitDesktop}
              className="px-3 py-1.5 text-xs font-mono bg-background/80 backdrop-blur-sm border border-primary/30 rounded text-primary hover:bg-primary/10 transition-colors"
            >
              ← Exit Desktop
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
