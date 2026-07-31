import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useRef } from 'react';

function About() {
  const containerRef = useRef(null);
  
  // Motion values to track the card's position during drag
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // String path: starts from bottom of the hook ring, ends at card hole
  const path = useTransform([x, y], ([latestX, latestY]) => {
    // Bottom of the hook ring (fixed anchor)
    const startX = 200;
    const startY = 36;

    // Card hole moves with the dragged card
    const endX = 200 + latestX;
    const endY = 50 + latestY;

    // Quadratic bezier control point — bows when dragged sideways
    const cpX = startX + (endX - startX) * 0.5;
    const cpY = startY + (endY - startY) * 0.5 + (Math.abs(latestX) * 0.18);

    return `M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}`;
  });

  return (
    <section className="about animate-fade-in delay-1">
      <h2 className="section-title">About Me</h2>
      
      <div className="lanyard-container" ref={containerRef}>

        {/* SVG: Hook + String */}
        <svg
          className="lanyard-svg"
          viewBox="0 0 400 600"
          style={{ width: '400px', left: '50%', transform: 'translateX(-50%)' }}
        >
          <defs>
            {/* Neon gradient for the string */}
            <linearGradient id="neon-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--accent-neon)" />
              <stop offset="100%" stopColor="var(--accent-cyan)" />
            </linearGradient>

            {/* Metallic gradient for the hook */}
            <linearGradient id="metal-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor="#e0e0e0" />
              <stop offset="40%"  stopColor="#9a9a9a" />
              <stop offset="100%" stopColor="#3a3a3a" />
            </linearGradient>

            {/* Shiny highlight on the ring */}
            <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.6" />
              <stop offset="50%"  stopColor="#888888" />
              <stop offset="100%" stopColor="#222222" />
            </linearGradient>

            <filter id="metal-shadow">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="rgba(0,0,0,0.7)" />
            </filter>
          </defs>

          {/* ── Wall mount bar (the screw/nail on the wall) ── */}
          <rect
            x="183" y="1" width="34" height="11" rx="5.5"
            fill="url(#metal-gradient)"
            filter="url(#metal-shadow)"
          />
          {/* Mount bar highlight */}
          <rect x="187" y="3" width="22" height="3" rx="1.5"
            fill="rgba(255,255,255,0.35)" />

          {/* ── Carabiner / hook ring ── */}
          {/* Outer ring */}
          <circle cx="200" cy="23" r="13"
            fill="none"
            stroke="url(#ring-gradient)"
            strokeWidth="4"
            filter="url(#metal-shadow)"
          />
          {/* Inner shine arc (top-left quarter) */}
          <path
            d="M 191 16 A 13 13 0 0 1 209 16"
            fill="none"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Small connecting pin between mount and ring */}
          <line x1="200" y1="11" x2="200" y2="10"
            stroke="url(#metal-gradient)" strokeWidth="3.5" strokeLinecap="round" />

          {/* ── Neon lanyard string ── */}
          <motion.path
            d={path}
            stroke="url(#neon-gradient)"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            style={{ filter: 'drop-shadow(0px 0px 7px var(--accent-cyan))' }}
          />
        </svg>

        {/* ── Draggable ID Card with Spring Physics ── */}
        <motion.div
          className="id-card"
          style={{ x, y, marginTop: '42px' }}
          drag
          dragConstraints={{ top: -20, left: -100, right: 100, bottom: 200 }}
          dragElastic={0.6}
          dragTransition={{ bounceStiffness: 400, bounceDamping: 15 }}
          whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <div className="card-hole"></div>
          <div className="card-header">
            <h3>Dharmit Monani</h3>
            <p>Computer Engineering Student</p>
          </div>
          <div className="card-photo">
            <img
              src="/profile.jpg"
              alt="Dharmit Monani"
              className="profile-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div className="photo-placeholder" style={{ display: 'none' }}>DM</div>
          </div>
          <div className="card-body">
            <p>
              UNIVERSITY: CHARUSAT<br />
              COURSE: B.Tech Computer Eng.<br />
              BATCH: 2025-2028
            </p>
            <p className="card-desc">
              Computer Engineering undergraduate with hands-on experience in full-stack
              web development and cybersecurity. Focused on developing scalable,
              user-centric applications.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default About;