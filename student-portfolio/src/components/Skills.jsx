import { useState } from 'react';

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const CAT_COLORS = {
  Language: '#00f3ff',
  Frontend: '#b026ff',
  Backend:  '#4ade80',
  Database: '#f59e0b',
  'AI/ML':  '#f43f5e',
  Security: '#fb923c',
};

const SKILLS = [
  { name: 'JavaScript',      icon: '⚡', level: 90, category: 'Language' },
  { name: 'Python',          icon: '🐍', level: 85, category: 'Language' },
  { name: 'React.js',        icon: '⚛️', level: 88, category: 'Frontend' },
  { name: 'Node.js',         icon: '🟢', level: 80, category: 'Backend'  },
  { name: 'Express.js',      icon: '🚂', level: 78, category: 'Backend'  },
  { name: 'MongoDB',         icon: '🍃', level: 75, category: 'Database' },
  { name: 'Flask',           icon: '🌶️', level: 72, category: 'Backend'  },
  { name: 'Machine Learning',icon: '🤖', level: 65, category: 'AI/ML'   },
  { name: 'Cybersecurity',   icon: '🛡️', level: 70, category: 'Security' },
  { name: 'REST APIs',       icon: '🔗', level: 85, category: 'Backend'  },
];

const CATEGORIES = ['All', ...Object.keys(CAT_COLORS)];

/* Pre-computed dust particles (stable across renders) */
const PARTICLES = [
  { id: 0,  left: '19%', dur: '3.4s', delay: '0.0s', sz: '2.5px', op: 0.55 },
  { id: 1,  left: '29%', dur: '4.2s', delay: '0.7s', sz: '2px',   op: 0.40 },
  { id: 2,  left: '41%', dur: '3.8s', delay: '1.3s', sz: '3px',   op: 0.50 },
  { id: 3,  left: '53%', dur: '5.1s', delay: '0.2s', sz: '2px',   op: 0.55 },
  { id: 4,  left: '65%', dur: '3.6s', delay: '0.9s', sz: '2.5px', op: 0.40 },
  { id: 5,  left: '76%', dur: '4.6s', delay: '1.9s', sz: '2px',   op: 0.60 },
  { id: 6,  left: '24%', dur: '4.0s', delay: '0.4s', sz: '3px',   op: 0.35 },
  { id: 7,  left: '47%', dur: '4.4s', delay: '1.6s', sz: '2px',   op: 0.50 },
  { id: 8,  left: '61%', dur: '5.3s', delay: '2.2s', sz: '2.5px', op: 0.45 },
  { id: 9,  left: '35%', dur: '3.7s', delay: '0.8s', sz: '2px',   op: 0.60 },
  { id: 10, left: '71%', dur: '4.9s', delay: '1.4s', sz: '3px',   op: 0.40 },
  { id: 11, left: '51%', dur: '3.4s', delay: '2.5s', sz: '2px',   op: 0.50 },
];

const R    = 28;
const CIRC = 2 * Math.PI * R; // ≈ 175.93

/* ─────────────────────────────────────────
   SKILL CARD
───────────────────────────────────────── */
function SkillCard({ skill, i, lampOn, isActive, color }) {
  const dashOffset = CIRC - (skill.level / 100) * CIRC;

  const tilt = (e) => {
    const el  = e.currentTarget;
    const r   = el.getBoundingClientRect();
    const x   = ((e.clientX - r.left) / r.width  - 0.5) * 22;
    const y   = ((e.clientY - r.top)  / r.height - 0.5) * -22;
    el.style.transform = `perspective(700px) rotateX(${y}deg) rotateY(${x}deg) scale(1.07)`;
    el.style.boxShadow = `0 8px 40px ${color}35, inset 0 0 24px rgba(0,0,0,0.4)`;
  };
  const resetTilt = (e) => {
    const el = e.currentTarget;
    el.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)';
    el.style.boxShadow = isActive
      ? `0 4px 30px ${color}18, inset 0 0 20px rgba(0,0,0,0.4)`
      : '0 4px 20px rgba(0,0,0,0.4)';
  };

  return (
    /* Float wrapper keeps animation separate from 3D tilt transform */
    <div style={{
      animation:      lampOn ? `sk-float ${3.2 + (i % 4) * 0.42}s ease-in-out infinite` : 'none',
      animationDelay: `${i * 0.13}s`,
    }}>
      <div
        onMouseMove={tilt}
        onMouseLeave={resetTilt}
        style={{
          background:           'rgba(255,255,255,0.03)',
          backdropFilter:       'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          border:        `1px solid ${isActive ? color + '55' : 'rgba(255,255,255,0.05)'}`,
          borderRadius:  '22px',
          padding:       '1.5rem 1rem',
          display:       'flex',
          flexDirection: 'column',
          alignItems:    'center',
          gap:           '0.75rem',
          cursor:        'default',
          transition:    'border-color 0.5s ease, box-shadow 0.5s ease, opacity 0.5s ease, filter 0.5s ease, transform 0.25s ease',
          opacity:       isActive ? 1 : 0.18,
          filter:        isActive ? 'none' : 'saturate(0.05)',
          boxShadow:     isActive
            ? `0 4px 30px ${color}18, inset 0 0 20px rgba(0,0,0,0.4)`
            : '0 4px 20px rgba(0,0,0,0.4)',
          willChange: 'transform',
        }}
      >
        {/* Circular SVG progress ring */}
        <div style={{ position: 'relative', width: '80px', height: '80px' }}>
          <svg width="80" height="80" viewBox="0 0 80 80" style={{ overflow: 'visible' }}>
            {/* Track */}
            <circle cx="40" cy="40" r={R} fill="none"
              stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
            {/* Glow layer (blurry duplicate) */}
            {isActive && (
              <circle cx="40" cy="40" r={R} fill="none"
                stroke={color} strokeWidth="10" opacity="0.12"
                strokeDasharray={CIRC}
                strokeDashoffset={lampOn && isActive ? dashOffset : CIRC}
                transform="rotate(-90 40 40)"
                style={{ transition: `stroke-dashoffset 1.9s ease ${0.2 + i * 0.07}s` }}
              />
            )}
            {/* Progress arc */}
            <circle cx="40" cy="40" r={R} fill="none"
              stroke={color} strokeWidth="5" strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={lampOn && isActive ? dashOffset : CIRC}
              transform="rotate(-90 40 40)"
              style={{
                transition: `stroke-dashoffset 1.9s ease ${0.3 + i * 0.08}s`,
                filter: `drop-shadow(0 0 6px ${color})`,
              }}
            />
          </svg>

          {/* Emoji centered in ring */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem', lineHeight: 1,
            filter:     isActive ? 'none' : 'grayscale(1)',
            transition: 'filter 0.5s ease',
          }}>
            {skill.icon}
          </div>
        </div>

        {/* Name */}
        <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#fff', textAlign: 'center', lineHeight: 1.3 }}>
          {skill.name}
        </div>

        {/* Category pill */}
        <div style={{
          fontSize: '0.61rem', fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color, background: `${color}18`,
          border: `1px solid ${color}38`,
          borderRadius: '20px', padding: '2px 10px',
        }}>
          {skill.category}
        </div>

        {/* Percentage */}
        <div style={{
          fontSize: '1.15rem', fontWeight: 800,
          fontVariantNumeric: 'tabular-nums',
          color, textShadow: `0 0 14px ${color}`,
        }}>
          {skill.level}%
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN SKILLS PAGE
───────────────────────────────────────── */
function Skills() {
  const [lampOn,         setLampOn]         = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <section style={{ position: 'relative' }}>

      {/* ── CSS Keyframes ── */}
      <style>{`
        @keyframes sk-swing {
          0%,100% { transform: rotate(-1.8deg); }
          50%      { transform: rotate( 1.8deg); }
        }
        @keyframes sk-flicker {
          0%,90%,100% { opacity: 1;   }
          91%          { opacity: 0.5; }
          92%          { opacity: 1;   }
          93%          { opacity: 0.3; }
          94%          { opacity: 1;   }
        }
        @keyframes sk-blink {
          0%,100% { opacity: 1;    }
          50%     { opacity: 0.08; }
        }
        @keyframes sk-float {
          0%,100% { transform: translateY(0);   }
          50%     { transform: translateY(-6px); }
        }
        @keyframes sk-particle {
          0%   { transform: translateY(0)      scale(1);   opacity: 0;   }
          12%  { opacity: 1; }
          88%  { opacity: 0.4; }
          100% { transform: translateY(-340px) scale(0.4); opacity: 0;   }
        }
        @keyframes sk-pulse {
          0%,100% { opacity: 0.14; transform: scale(1);    }
          50%     { opacity: 0.26; transform: scale(1.12); }
        }
        @keyframes sk-glitch {
          0%,86%,100% {
            text-shadow: 0 0 22px #00f3ff, 0 0 44px rgba(0,243,255,0.3);
          }
          87% { text-shadow: -3px 0 #b026ff, 3px 0 #00f3ff, 0 0 22px #00f3ff; }
          88% { text-shadow:  3px 0 #b026ff,-3px 0 #00f3ff, 0 0 22px #00f3ff; }
          89% { text-shadow: 0 0 22px #00f3ff, 0 0 44px rgba(0,243,255,0.3);  }
        }
      `}</style>

      {/* ── Ambient radial glow (behind everything) ── */}
      <div style={{
        position: 'absolute', top: '-100px', left: '50%',
        transform: 'translateX(-50%)',
        width: '600px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,243,255,0.18) 0%, rgba(176,38,255,0.08) 45%, transparent 70%)',
        animation:  lampOn ? 'sk-pulse 4.5s ease-in-out infinite' : 'none',
        opacity:    lampOn ? 1 : 0,
        transition: 'opacity 1.8s ease',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ── Blur overlay (lamp OFF) ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background:           'rgba(0,0,0,0.92)',
        backdropFilter:       lampOn ? 'blur(0px)'  : 'blur(18px)',
        WebkitBackdropFilter: lampOn ? 'blur(0px)'  : 'blur(18px)',
        opacity:    lampOn ? 0 : 1,
        transition: 'opacity 1.8s ease, backdrop-filter 1.8s ease',
        pointerEvents: 'none', zIndex: 5,
        borderRadius: '16px',
      }} />

      {/* ── Page content ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>

        {/* ══════════════════════════════
            LAMP SVG
        ══════════════════════════════ */}
        <div
          onClick={() => setLampOn(v => !v)}
          title={lampOn ? 'Click to turn off' : 'Click to turn on'}
          style={{
            animation: 'sk-swing 5s ease-in-out infinite',
            transformOrigin: 'top center',
            cursor: 'pointer',
            position: 'relative', zIndex: 10,
          }}
        >
          <svg width="144" height="215" viewBox="0 0 144 215" style={{ overflow: 'visible' }}>
            <defs>
              <radialGradient id="sk-bulb" cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor={lampOn ? '#ffffff' : '#1a1a1a'} />
                <stop offset="30%"  stopColor={lampOn ? '#fffde0' : '#111'}    />
                <stop offset="100%" stopColor={lampOn ? '#00f3ff' : '#090909'} />
              </radialGradient>
              <linearGradient id="sk-shade" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#1d1d3a" />
                <stop offset="100%" stopColor="#0c1432" />
              </linearGradient>
              <linearGradient id="sk-metal" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%"   stopColor="#ddd" />
                <stop offset="50%"  stopColor="#888" />
                <stop offset="100%" stopColor="#333" />
              </linearGradient>
            </defs>

            {/* Ceiling mount bar */}
            <rect x="47" y="0" width="50" height="13" rx="6.5" fill="url(#sk-metal)" />
            <rect x="56" y="2.5" width="32" height="5"  rx="2.5" fill="rgba(255,255,255,0.32)" />
            <circle cx="55" cy="6.5" r="3.5" fill="#444" />
            <circle cx="55" cy="6.5" r="1.4" fill="#1a1a1a" />
            <circle cx="89" cy="6.5" r="3.5" fill="#444" />
            <circle cx="89" cy="6.5" r="1.4" fill="#1a1a1a" />

            {/* Wire / cord */}
            <line x1="72" y1="13" x2="72" y2="102"
              stroke={lampOn ? '#00f3ff' : '#252525'} strokeWidth="3" strokeLinecap="round"
              style={{ filter: lampOn ? 'drop-shadow(0 0 7px #00f3ff)' : 'none', transition: 'all 0.8s ease' }}
            />

            {/* Hook / carabiner ring */}
            <circle cx="72" cy="102" r="7.5"
              fill="none" stroke="url(#sk-metal)" strokeWidth="3.5"
              style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.9))' }}
            />
            {/* Hook ring shine arc */}
            <path d="M 66.5 97.5 A 7.5 7.5 0 0 1 77.5 97.5"
              fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8" strokeLinecap="round" />

            {/* Shade top cap */}
            <rect x="59" y="109" width="26" height="9" rx="4.5"
              fill={lampOn ? '#00f3ff' : '#1e1e1e'}
              style={{ transition: 'all 0.8s ease', filter: lampOn ? 'drop-shadow(0 0 12px #00f3ff)' : 'none' }}
            />

            {/* Shade body */}
            <path d="M 16 172  L 39 118  L 105 118  L 128 172  Z"
              fill="url(#sk-shade)"
              stroke={lampOn ? '#00f3ff' : '#1a1a2e'}
              strokeWidth={lampOn ? 1.5 : 0.5}
              style={{
                transition: 'all 0.8s ease',
                filter: lampOn ? 'drop-shadow(0 0 20px rgba(0,243,255,0.55))' : 'none',
              }}
            />

            {/* Shade inner highlight */}
            <path d="M 24 167 L 43 122 L 62 122 L 44 167 Z" fill="rgba(255,255,255,0.035)" />

            {/* Shade detail lines */}
            {[
              [41, 120, 23, 165],
              [54, 119, 46, 168],
              [72, 118, 72, 168],
              [90, 119, 98, 168],
              [103, 120, 121, 165],
            ].map(([x1, y1, x2, y2], idx) => (
              <line key={idx} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
            ))}

            {/* Bulb ambient halos */}
            {lampOn && <>
              <circle cx="72" cy="142" r="38" fill="#00f3ff" opacity="0.04" />
              <circle cx="72" cy="142" r="27" fill="#00f3ff" opacity="0.07" />
            </>}

            {/* Bulb */}
            <circle cx="72" cy="142" r="19" fill="url(#sk-bulb)"
              style={{
                filter: lampOn
                  ? 'drop-shadow(0 0 30px #00f3ff) drop-shadow(0 0 65px rgba(0,243,255,0.45))'
                  : 'none',
                animation:  lampOn ? 'sk-flicker 11s infinite' : 'none',
                transition: 'all 0.8s ease',
              }}
            />

            {/* Aura rings */}
            {lampOn && <>
              <circle cx="72" cy="142" r="28" fill="none" stroke="rgba(0,243,255,0.48)" strokeWidth="1.5" />
              <circle cx="72" cy="142" r="37" fill="none" stroke="rgba(0,243,255,0.22)" strokeWidth="0.8" />
              <circle cx="72" cy="142" r="46" fill="none" stroke="rgba(0,243,255,0.08)" strokeWidth="0.5" />
            </>}

            {/* Bottom rim glow ellipse */}
            <ellipse cx="72" cy="172" rx="56" ry="7"
              fill={lampOn ? 'rgba(0,243,255,0.28)' : 'transparent'}
              style={{ transition: 'all 0.8s ease' }}
            />
          </svg>
        </div>

        {/* Status indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '7px',
          marginTop: '-20px', marginBottom: '4px',
          fontSize: '0.68rem', fontWeight: 800,
          letterSpacing: '0.16em', textTransform: 'uppercase',
          color:      lampOn ? '#00f3ff' : '#333',
          transition: 'color 0.8s ease',
        }}>
          <div style={{
            width: '7px', height: '7px', borderRadius: '50%',
            background: lampOn ? '#00f3ff' : '#222',
            boxShadow:  lampOn ? '0 0 10px #00f3ff, 0 0 22px rgba(0,243,255,0.5)' : 'none',
            animation:  lampOn ? 'sk-blink 2s infinite' : 'none',
            transition: 'all 0.8s ease',
          }} />
          {lampOn ? 'Illuminated' : 'Lights Out'}
        </div>

        {/* ══════════════════════════════
            LIGHT BEAM + DUST PARTICLES
        ══════════════════════════════ */}
        <div style={{
          position: 'absolute', top: '196px',
          width: '780px', maxWidth: '100%',
          zIndex: 1, pointerEvents: 'none',
        }}>
          {/* Cone */}
          <div style={{
            width: '100%',
            height: lampOn ? '420px' : '0px',
            background: `linear-gradient(
              to bottom,
              rgba(0,243,255,0.30) 0%,
              rgba(176,38,255,0.12) 50%,
              transparent 100%
            )`,
            clipPath: 'polygon(38% 0%, 62% 0%, 100% 100%, 0% 100%)',
            transition: 'height 1.5s ease',
          }} />

          {/* Dust particles inside beam */}
          {PARTICLES.map(p => (
            <div key={p.id} style={{
              position: 'absolute', bottom: '0', left: p.left,
              width: p.sz, height: p.sz, borderRadius: '50%',
              background: '#00f3ff',
              boxShadow:  '0 0 5px #00f3ff, 0 0 12px rgba(0,243,255,0.5)',
              opacity:    lampOn ? p.op : 0,
              animation:  lampOn ? `sk-particle ${p.dur} ${p.delay} infinite ease-in` : 'none',
              transition: 'opacity 1.5s ease',
            }} />
          ))}
        </div>

        {/* ══════════════════════════════
            HEADING (with glitch effect)
        ══════════════════════════════ */}
        <h2 style={{
          marginTop: '2.5rem', marginBottom: 0,
          fontSize: '2.6rem', fontWeight: 700, letterSpacing: '-0.02em',
          background: 'linear-gradient(135deg, #00f3ff 0%, #b026ff 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          animation:  lampOn ? 'sk-glitch 9s infinite' : 'none',
          opacity:    lampOn ? 1 : 0,
          filter:     lampOn ? 'none' : 'blur(8px)',
          transform:  lampOn ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 1.5s ease',
          position: 'relative', zIndex: 2,
        }}>
          Skills &amp; Tech Stack
        </h2>

        <p style={{
          color: 'rgba(255,255,255,0.28)', fontSize: '0.78rem',
          marginTop: '0.5rem', marginBottom: '1.6rem',
          opacity:    lampOn ? 1 : 0,
          transition: 'opacity 1.5s ease 0.1s',
          position: 'relative', zIndex: 2,
        }}>
          Click the lamp to toggle · Hover cards for 3D tilt
        </p>

        {/* ══════════════════════════════
            CATEGORY FILTER TABS
        ══════════════════════════════ */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '0.5rem',
          justifyContent: 'center', marginBottom: '2.2rem',
          opacity:    lampOn ? 1 : 0,
          transition: 'opacity 1.5s ease 0.2s',
          position: 'relative', zIndex: 2,
        }}>
          {CATEGORIES.map(cat => {
            const isActive = activeCategory === cat;
            const color    = CAT_COLORS[cat] || '#00f3ff';
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  background:    isActive ? `${color}22` : 'rgba(255,255,255,0.03)',
                  border:        `1px solid ${isActive ? color : 'rgba(255,255,255,0.08)'}`,
                  borderRadius:  '30px',
                  padding:       '0.42rem 1.15rem',
                  fontSize:      '0.72rem', fontWeight: 700,
                  letterSpacing: '0.07em', textTransform: 'uppercase',
                  color:         isActive ? color : 'rgba(255,255,255,0.35)',
                  cursor:        'pointer',
                  transition:    'all 0.3s ease',
                  boxShadow:     isActive ? `0 0 18px ${color}45` : 'none',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* ══════════════════════════════
            SKILLS GRID
        ══════════════════════════════ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(162px, 1fr))',
          gap: '1.3rem', width: '100%',
          opacity:    lampOn ? 1 : 0,
          filter:     lampOn ? 'none' : 'blur(14px)',
          transform:  lampOn ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 1.5s ease 0.15s',
          position: 'relative', zIndex: 2,
        }}>
          {SKILLS.map((skill, i) => {
            const color    = CAT_COLORS[skill.category] || '#00f3ff';
            const isActive = activeCategory === 'All' || activeCategory === skill.category;
            return (
              <SkillCard
                key={skill.name}
                skill={skill}
                i={i}
                lampOn={lampOn}
                isActive={isActive}
                color={color}
              />
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default Skills;