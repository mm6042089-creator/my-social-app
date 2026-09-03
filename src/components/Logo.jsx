import React from "react";

export function MaivenMark({ size = 28, spin = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={spin ? "maiven-spin" : ""}>
      <defs>
        <linearGradient id="mvGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7C4DFF" />
          <stop offset="0.55" stopColor="#B34DFF" />
          <stop offset="1" stopColor="#FF5CA6" />
        </linearGradient>
      </defs>
      <circle cx="20" cy="20" r="17.5" fill="none" stroke="url(#mvGrad)" strokeWidth="1.4" opacity="0.35" />
      <path
        d="M7 30 L7 11 L14.5 22 L20 12.5 L25.5 22 L33 11 L33 30"
        fill="none"
        stroke="url(#mvGrad)"
        strokeWidth="4.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="33" cy="9.5" r="3.4" fill="url(#mvGrad)" />
    </svg>
  );
}

export default function Logo({ withWordmark = true, size = 26 }) {
  return (
    <div className="maiven-logo">
      <MaivenMark size={size} />
      {withWordmark && <span className="maiven-wordmark">MAIVEN</span>}
    </div>
  );
}
