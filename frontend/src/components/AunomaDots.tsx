import React from "react";

export function AunomaDots({ className = "" }: { className?: string }) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      role="img"
    >
      {/* Main larger dots */}
      <circle cx="14" cy="14" r="6" fill="#D10A11" opacity="0.95" />
      <circle cx="14" cy="42" r="4" fill="#D10A11" opacity="0.85" />
      <circle cx="14" cy="70" r="5" fill="#D10A11" opacity="0.9" />
      <circle cx="42" cy="14" r="3" fill="#D10A11" opacity="0.8" />
      <circle cx="42" cy="42" r="7" fill="#D10A11" opacity="1" />
      
      {/* Medium sized dots */}
      <circle cx="28" cy="28" r="4" fill="#D10A11" opacity="0.85" />
      <circle cx="28" cy="56" r="2" fill="#D10A11" opacity="0.75" />
      <circle cx="28" cy="84" r="3" fill="#D10A11" opacity="0.8" />

      {/* Smaller dots */}
      <circle cx="6" cy="6" r="2" fill="#D10A11" opacity="0.75" />
      <circle cx="6" cy="34" r="3" fill="#D10A11" opacity="0.8" />
      <circle cx="6" cy="62" r="2" fill="#D10A11" opacity="0.75" />
      <circle cx="34" cy="6" r="4" fill="#D10A11" opacity="0.85" />
      <circle cx="34" cy="34" r="3" fill="#D10A11" opacity="0.8" />
      <circle cx="34" cy="62" r="5" fill="#D10A11" opacity="0.9" />
      <circle cx="62" cy="6" r="2" fill="#D10A11" opacity="0.75" />
      <circle cx="62" cy="34" r="5" fill="#D10A11" opacity="0.9" />
      <circle cx="62" cy="62" r="3" fill="#D10A11" opacity="0.8" />

      {/* Additional small dots */}
      <circle cx="20" cy="20" r="3" fill="#D10A11" opacity="0.8" />
      <circle cx="20" cy="48" r="2" fill="#D10A11" opacity="0.75" />
      <circle cx="20" cy="76" r="4" fill="#D10A11" opacity="0.85" />
      <circle cx="48" cy="20" r="4" fill="#D10A11" opacity="0.85" />
      <circle cx="48" cy="48" r="3" fill="#D10A11" opacity="0.8" />
      <circle cx="48" cy="76" r="5" fill="#D10A11" opacity="0.9" />
      <circle cx="76" cy="20" r="2" fill="#D10A11" opacity="0.75" />
      <circle cx="76" cy="48" r="4" fill="#D10A11" opacity="0.85" />
      <circle cx="76" cy="76" r="3" fill="#D10A11" opacity="0.8" />

      {/* Extra fine details */}
      <circle cx="10" cy="24" r="1.5" fill="#D10A11" opacity="0.7" />
      <circle cx="18" cy="36" r="1.2" fill="#D10A11" opacity="0.65" />
      <circle cx="26" cy="10" r="1.7" fill="#D10A11" opacity="0.72" />
      <circle cx="50" cy="34" r="1.8" fill="#D10A11" opacity="0.73" />
      <circle cx="34" cy="50" r="1.4" fill="#D10A11" opacity="0.68" />
      <circle cx="66" cy="26" r="1.6" fill="#D10A11" opacity="0.71" />
      <circle cx="78" cy="34" r="1.3" fill="#D10A11" opacity="0.67" />
      <circle cx="90" cy="42" r="1.7" fill="#D10A11" opacity="0.72" />
      <circle cx="22" cy="62" r="1.4" fill="#D10A11" opacity="0.68" />
      <circle cx="38" cy="78" r="1.5" fill="#D10A11" opacity="0.7" />
      <circle cx="50" cy="90" r="1.6" fill="#D10A11" opacity="0.71" />
      <circle cx="74" cy="62" r="1.2" fill="#D10A11" opacity="0.65" />
      <circle cx="86" cy="74" r="1.5" fill="#D10A11" opacity="0.7" />
      <circle cx="90" cy="84" r="1.3" fill="#D10A11" opacity="0.67" />

      {/* Dot in the 'i' position for Aunoma.ai */}
      <circle cx="92" cy="14" r="1.8" fill="#D10A11" opacity="1" />
    </svg>
  );
}
