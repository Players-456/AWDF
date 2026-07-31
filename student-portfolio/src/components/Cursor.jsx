import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

function Cursor() {
  const [isHover, setIsHover]   = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible]   = useState(false);

  // Raw mouse position
  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  // Dot follows mouse instantly
  const dotX = useSpring(rawX, { stiffness: 2000, damping: 60, mass: 0.2 });
  const dotY = useSpring(rawY, { stiffness: 2000, damping: 60, mass: 0.2 });

  // Outline lags behind a little for a trailing effect
  const ringX = useSpring(rawX, { stiffness: 300, damping: 30, mass: 0.5 });
  const ringY = useSpring(rawY, { stiffness: 300, damping: 30, mass: 0.5 });

  useEffect(() => {
    const move = (e) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const enter = () => setIsVisible(true);
    const leave = () => setIsVisible(false);

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseenter', enter);
    document.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseenter', enter);
      document.removeEventListener('mouseleave', leave);
    };
  }, [rawX, rawY, isVisible]);

  // Hover detection on interactive elements
  useEffect(() => {
    const selector = 'a, button, .nav-link, .skill-chip, .submit-btn, input, textarea, [role="button"]';

    const over = (e) => { if (e.target.matches && e.target.matches(selector)) setIsHover(true); };
    const out  = (e) => { if (e.target.matches && e.target.matches(selector)) setIsHover(false); };

    document.body.addEventListener('mouseover', over);
    document.body.addEventListener('mouseout',  out);
    return () => {
      document.body.removeEventListener('mouseover', over);
      document.body.removeEventListener('mouseout',  out);
    };
  }, []);

  // Click ripple
  useEffect(() => {
    const down = () => setIsClicking(true);
    const up   = () => setIsClicking(false);
    window.addEventListener('mousedown', down);
    window.addEventListener('mouseup',   up);
    return () => {
      window.removeEventListener('mousedown', down);
      window.removeEventListener('mouseup',   up);
    };
  }, []);

  return (
    <>
      {/* Inner dot — snappy & instant */}
      <motion.div
        className="cursor-dot"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
          scale: isClicking ? 0.5 : isHover ? 1.5 : 1,
        }}
        transition={{ scale: { type: 'spring', stiffness: 600, damping: 25 } }}
      />

      {/* Outer ring — smooth trailing lag */}
      <motion.div
        className="cursor-outline"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          scale:       isClicking ? 0.75 : isHover ? 1.8 : 1,
          borderColor: isHover
            ? 'var(--accent-neon)'
            : 'rgba(0,243,255,0.7)',
          borderWidth: isHover ? '3px' : '2px',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      />
    </>
  );
}

export default Cursor;
