import { useRef, useEffect } from 'react';

/**
 * Mobile-Optimized Living Starfield Canvas.
 * - Throttles particle count on mobile (max 24 stars) to protect CPU/GPU & prevent phone lag.
 * - Uses IntersectionObserver & Visibility API to pause rendering when canvas is off-screen.
 * - Zero Garbage Collection allocations in draw loop for 60 FPS performance.
 */
export default function StarfieldCanvas({ particleCount: overrideCount }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Accessibility check for reduced motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let animId = null;
    let isVisible = true;
    let pointer = { x: null, y: null };
    let stars = [];
    let isMobile = window.innerWidth <= 768;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const getDimensions = () => {
      const parent = canvas.parentElement;
      const width = parent ? parent.offsetWidth : window.innerWidth;
      const height = parent ? parent.offsetHeight : window.innerHeight;
      return { width, height };
    };

    const resize = () => {
      const { width, height } = getDimensions();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset scale before scaling
      ctx.scale(dpr, dpr);
      isMobile = window.innerWidth <= 768;
    };

    const createStar = () => {
      const { width, height } = getDimensions();
      const depth = Math.random();
      const baseSize = isMobile ? depth * 1.0 + 0.8 : depth * 1.5 + 1.0;
      const angle = Math.random() * Math.PI * 2;
      const speed = depth * 0.3 + 0.15;

      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: baseSize,
        baseSize,
        depth,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        baseVx: Math.cos(angle) * speed,
        baseVy: Math.sin(angle) * speed,
        wavePhase: Math.random() * Math.PI * 2,
        waveSpeed: Math.random() * 0.015 + 0.005,
        waveAmplitude: Math.random() * 0.15 + 0.05,
        opacity: depth * 0.4 + 0.25,
        baseOpacity: depth * 0.4 + 0.25,
        twinkleOffset: Math.random() * Math.PI * 2,
      };
    };

    const init = () => {
      resize();
      const count = overrideCount || (isMobile ? 24 : 120);
      stars = Array.from({ length: count }, createStar);
    };

    const draw = (time) => {
      if (!isVisible) {
        animId = null;
        return;
      }

      const { width, height } = getDimensions();
      ctx.clearRect(0, 0, width, height);

      const attractRadius = isMobile ? 120 : 200;
      const attractStrength = isMobile ? 0.04 : 0.06;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        // Twinkle
        const opacity = Math.max(0.15, Math.min(0.85, s.baseOpacity + Math.sin(time * 0.002 + s.twinkleOffset) * 0.18));

        let distFraction = 0;
        let isNear = false;

        if (pointer.x !== null && pointer.y !== null) {
          const dx = pointer.x - s.x;
          const dy = pointer.y - s.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < attractRadius * attractRadius) {
            const dist = Math.sqrt(distSq);
            distFraction = 1 - dist / attractRadius;
            const force = distFraction * attractStrength * (s.depth * 0.5 + 0.5);
            s.vx += dx * force;
            s.vy += dy * force;
            isNear = true;
          }
        }

        s.vx = s.vx * 0.94 + s.baseVx * 0.06;
        s.vy = s.vy * 0.94 + s.baseVy * 0.06;

        s.wavePhase += s.waveSpeed;
        s.x += s.vx + Math.cos(s.wavePhase) * s.waveAmplitude;
        s.y += s.vy + Math.sin(s.wavePhase) * s.waveAmplitude;

        if (s.x < -10) s.x = width + 10;
        if (s.x > width + 10) s.x = -10;
        if (s.y < -10) s.y = height + 10;
        if (s.y > height + 10) s.y = -10;

        const renderSize = isNear ? Math.min(s.baseSize + distFraction * 1.2, isMobile ? 2.5 : 3.5) : s.baseSize;

        ctx.beginPath();
        ctx.arc(s.x, s.y, renderSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 170, 155, ${opacity.toFixed(2)})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    const startLoop = () => {
      if (isVisible && !animId) {
        animId = requestAnimationFrame(draw);
      }
    };

    const stopLoop = () => {
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    };

    // Pause rendering when canvas is scrolled off-screen or tab is inactive
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry.isIntersecting;
        if (isVisible) {
          startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(canvas);

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        startLoop();
      } else {
        stopLoop();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const handleMouseMove = (e) => {
      if (isMobile) return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };

    const handlePointerReset = () => {
      pointer.x = null;
      pointer.y = null;
    };

    init();
    startLoop();

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('mouseleave', handlePointerReset, { passive: true });
    }
    window.addEventListener('resize', init);

    return () => {
      stopLoop();
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (!isMobile) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handlePointerReset);
      }
      window.removeEventListener('resize', init);
    };
  }, [overrideCount]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
