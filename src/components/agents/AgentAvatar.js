"use client";

import React from 'react';

/*
  Reusable animated Agent Avatar component.
  Goal: centralize shared SVG scaffold (outer ring, halo, face, eyes, mouth) and allow per-agent decorative layers.

  Props:
  - type: agent key (punchy | lingo | reply | scribo | glow | pitchy | foody | globo | psyco | talko | fitzy | agents)
  - size: number (pixel size, default 180)
  - title / desc: accessible text overrides
  - decorative?: boolean (enable unique extras)

  Implementation phase 1: Provide punchy & lingo mappings as pilot; fall back to <img src> for others until migrated.
*/

const BASE_SIZE = 240; // native viewBox size

const agentConfigs = {
  lingo: {
    title: 'Lingo Bot',
    desc: 'Animated avatar for language translation with floating glyphs.',
    faceGradient: (
      <radialGradient id="faceGrad" cx="0.5" cy="0.5" r="0.55">
        <stop offset="0%" stopColor="#FFE08A" />
        <stop offset="55%" stopColor="#F5B533" />
        <stop offset="100%" stopColor="#B46307" />
      </radialGradient>
    ),
    ringGradient: (
      <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FFDD55" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
    ),
    innerShadowColor: '#9A5B08',
    haloColor: '#F59E0B',
    eyeIris: '#7A3A00',
    browStroke: '#FFE8BD',
    mouthStroke: '#FFE8BD',
    extras: (
      <>
        {/* Forehead Globe */}
        <g className="glyph" transform="translate(0,-6)">
          <circle cx="120" cy="70" r="18" fill="#FCD34D" stroke="#92400E" strokeWidth="2" />
          <path d="M108 70 H132 M120 58 V82 M108 64 C108 64 114 78 120 78 C126 78 132 64 132 64 M108 76 C108 76 114 62 120 62 C126 62 132 76 132 76" stroke="#92400E" strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
        {/* Translation bubbles */}
        <g className="float" style={{animationDelay:'.3s'}}>
          <path d="M58 122 L72 108 H96 L110 122 L96 136 H72 Z" fill="#FCD34D" stroke="#8B4A05" strokeWidth="2" strokeLinejoin="round" />
          <text x="78" y="123" fontFamily="Inter, Arial" fontSize="14" fontWeight={600} fill="#7A3A00">Hi</text>
        </g>
        <g className="float" style={{animationDelay:'1.1s'}}>
          <path d="M130 122 L144 108 H168 L182 122 L168 136 H144 Z" fill="#FCD34D" stroke="#8B4A05" strokeWidth="2" strokeLinejoin="round" />
          <text x="148" y="123" fontFamily="Inter, Arial" fontSize="14" fontWeight={600} fill="#7A3A00">Hola</text>
        </g>
        {/* Floating language glyphs */}
        <g fontFamily="Inter, Arial" fontSize="20" fill="#FFE8BD" fontWeight={600}>
          <text className="glyph" x="70" y="54">A</text>
          <text className="glyph" x="96" y="42">あ</text>
            <text className="glyph" x="132" y="42">字</text>
          <text className="glyph" x="164" y="54">إ</text>
        </g>
        <rect x="70" y="190" width="100" height="14" rx="7" fill="#FBBF24" opacity="0.5" />
      </>
    )
  },
  punchy: {
    title: 'Punchy Bot',
    desc: 'Energetic avatar with wink and punctuation bursts.',
    faceGradient: (
      <radialGradient id="faceGrad" cx="0.5" cy="0.5" r="0.55">
        <stop offset="0%" stopColor="#C084FC" />
        <stop offset="55%" stopColor="#9333EA" />
        <stop offset="100%" stopColor="#5B21B6" />
      </radialGradient>
    ),
    ringGradient: (
      <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F0ABFC" />
        <stop offset="40%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#7E22CE" />
      </linearGradient>
    ),
    innerShadowColor: '#4C1D95',
    haloColor: '#7C3AED',
    eyeIris: '#4C1D95',
    browStroke: '#E9D5FF',
    mouthStroke: '#E9D5FF',
    extras: (
      <>
        {/* Bow tie */}
        <g className="p-bow">
          <path d="M96 133 L120 140 L144 133 L120 126 Z" fill="#A855F7" />
          <circle cx="120" cy="133" r="7" fill="#7E22CE" />
        </g>
        {/* Microphone */}
        <g className="p-mic">
          <rect x="113" y="156" width="14" height="36" rx="7" fill="#6D28D9" />
          <circle cx="120" cy="200" r="16" fill="#7E22CE" />
          <circle cx="120" cy="200" r="10" fill="#A855F7" opacity="0.55" />
        </g>
        {/* Punctuation bursts */}
        <g fontFamily="Inter, Arial" fontWeight="700" fill="#F0ABFC" fontSize="20">
          <text className="p-burst" x="184" y="70">!</text>
          <text className="p-burst" x="48" y="70">?</text>
        </g>
        <rect x="70" y="192" width="100" height="14" rx="7" fill="#A855F7" opacity="0.35" />
      </>
    )
  }
};

// Shared CSS animations (merged subset for the migrated agents)
const sharedStyles = `
  .ring { stroke-dasharray: 12 14; }
  .halo { animation: pulse 5s ease-in-out infinite; }
  .eye { animation: blink 6s ease-in-out infinite; transform-origin:center; }
  .eye.right { animation-delay: 2s; }
  .mouth { animation: talk 3.8s ease-in-out infinite; transform-origin:120px 150px; }
  .glyph { animation: bob 4.5s ease-in-out infinite; }
  .glyph:nth-child(2) { animation-delay:1s; }
  .glyph:nth-child(3) { animation-delay:2s; }
  .glyph:nth-child(4) { animation-delay:3s; }
  .float { animation: drift 7s ease-in-out infinite; }
  .float:nth-child(2) { animation-delay:1.4s; }
  .float:nth-child(3) { animation-delay:2.8s; }
  /* Punchy specific within shared sheet */
  .p-bow { animation: pr-pulse 5.5s ease-in-out infinite; transform-origin:120px 128px; }
  .p-mic { animation: pr-bounce 5s ease-in-out infinite; transform-origin:120px 180px; }
  .p-burst { animation: pr-bob 4.2s ease-in-out infinite; }
  .p-burst:nth-child(2) { animation-delay:1.2s; }
  .wink path { animation: pr-wink 6s ease-in-out infinite; }

  /* spin & hue animations removed per request (ring static) */
  @keyframes blink { 0%,5%,95%,100% { transform:scaleY(1);} 2%,3% { transform:scaleY(.1);} }
  @keyframes talk { 0%,100% { transform:scale(1);} 50% { transform:scale(1.07);} }
  @keyframes drift { 0%,100% { transform:translateY(0);} 50% { transform:translateY(-18px);} }
  @keyframes bob { 0%,100% { transform:translateY(0);} 50% { transform:translateY(-8px);} }
  @keyframes pulse { 0%,100% { opacity:.25; transform:scale(1);} 50% { opacity:.45; transform:scale(1.08);} }
  /* Punchy */
  @keyframes pr-bob { 0%,100% { transform:translateY(0);} 50% { transform:translateY(-10px);} }
  @keyframes pr-bounce { 0%,100% { transform:translateY(0);} 35% { transform:translateY(-14px);} 70% { transform:translateY(-6px);} }
  @keyframes pr-pulse { 0%,100% { transform:scale(1);} 50% { transform:scale(1.12);} }
  @keyframes pr-wink { 0%,10%,90%,100% { stroke-dasharray:40 0; } 45%,55% { stroke-dasharray:0 40; } }
`;

export function AgentAvatar({ type = 'lingo', size = 180, title, desc, decorative = true, className = '' }) {
  const cfg = agentConfigs[type];
  if (!cfg) {
    // Fallback: keep existing <img> approach outside migrated agents
    return null;
  }
  const scale = size / BASE_SIZE;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 240 240"
      role="img"
      aria-labelledby="title desc"
      className={className}
    >
      <title id="title">{title || cfg.title}</title>
      <desc id="desc">{desc || cfg.desc}</desc>
      <defs>
        {cfg.faceGradient}
        {cfg.ringGradient}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix in="blur" type="matrix" values="0 0 0 0 1  0 0 0 0 0.75  0 0 0 0 0.25  0 0 0 0.6 0" result="col" />
          <feBlend in="SourceGraphic" in2="col" mode="screen" />
        </filter>
        <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={cfg.innerShadowColor} floodOpacity="0.55" />
        </filter>
        <style>{sharedStyles}</style>
      </defs>
      {/* Outer ring */}
      <g filter="url(#glow)">
        <circle cx="120" cy="120" r="110" fill="none" stroke="url(#ringGrad)" strokeWidth="8" className="ring" strokeLinecap="round" />
      </g>
      {/* Halo */}
      <circle cx="120" cy="120" r="100" fill={cfg.haloColor} opacity="0.18" className="halo" />
      {/* Face */}
      <circle cx="120" cy="120" r="92" fill="url(#faceGrad)" filter="url(#innerShadow)" />
      {/* Eyes */}
      {type === 'punchy' ? (
        <>
          <g className="eye">
            <circle cx="84" cy="108" r="17" fill="#FFF" />
            <circle cx="84" cy="108" r="7" fill={cfg.eyeIris} />
          </g>
          <g className="eye wink">
            <path d="M150 108 C156 104 164 104 170 108" stroke="#F0ABFC" strokeWidth="8" strokeLinecap="round" />
          </g>
        </>
      ) : (
        <g>
          <g className="eye left">
            <circle cx="85" cy="108" r="17" fill="#FFF" />
            <circle cx="85" cy="108" r="7" fill={cfg.eyeIris} />
          </g>
          <g className="eye right">
            <circle cx="155" cy="108" r="17" fill="#FFF" />
            <circle cx="155" cy="108" r="7" fill={cfg.eyeIris} />
          </g>
        </g>
      )}
      {/* Brows */}
      <path d="M66 78 C82 70 98 70 110 78" stroke={cfg.browStroke} strokeWidth={type === 'punchy' ? 8 : 7} strokeLinecap="round" />
      <path d="M130 78 C146 70 162 70 174 78" stroke={cfg.browStroke} strokeWidth={type === 'punchy' ? 8 : 7} strokeLinecap="round" />
      {/* Mouth */}
      <path className="mouth" d={type === 'punchy' ? 'M78 160 Q120 188 162 160' : 'M80 160 Q120 190 160 160'} stroke={cfg.mouthStroke} strokeWidth={type === 'punchy' ? 8 : 7} strokeLinecap="round" fill="none" />
      {decorative && cfg.extras}
    </svg>
  );
}

export default AgentAvatar;
