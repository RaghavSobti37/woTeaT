import React from 'react';

// Common SVG Wrapper Props
const defaultProps = {
  width: "24",
  height: "24",
  className: "",
  style: {}
};

export function SovietStar({ width = "24", height = "24", className = "", style = {} }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="#C8102E" stroke="#1C1C1C" strokeWidth="1.5" />
      <polygon points="12,5 13.85,8.76 18,9.36 15,12.28 15.71,16.41 12,14.46 8.29,16.41 9,12.28 6,9.36 10.15,8.76" fill="none" stroke="#FAF8F5" strokeWidth="1" />
    </svg>
  );
}

export function CanteenGear({ width = "24", height = "24", className = "" }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="12" cy="12" r="5" fill="none" stroke="#1C1C1C" strokeWidth="3" />
      <circle cx="12" cy="12" r="1.5" fill="#C8102E" />
      {/* Gear Teeth */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
        <line
          key={idx}
          x1="12"
          y1="4"
          x2="12"
          y2="1"
          stroke="#1C1C1C"
          strokeWidth="3.5"
          transform={`rotate(${angle} 12 12)`}
        />
      ))}
    </svg>
  );
}

export function MisalBowl({ width = "24", height = "24", className = "" }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Bowl silhouette */}
      <path d="M2 10C2 16 6 18 12 18C18 18 22 16 22 10H2Z" fill="#FAF8F5" stroke="#1C1C1C" strokeWidth="2.5" />
      <rect x="8" y="18" width="8" height="2" fill="#1C1C1C" />
      <line x1="2" y1="10" x2="22" y2="10" stroke="#C8102E" strokeWidth="2" />
      {/* Steam lines */}
      <path d="M7 7C7.5 5 6.5 4 7 2" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 7C12.5 5 11.5 4 12 2" stroke="#C8102E" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M17 7C17.5 5 16.5 4 17 2" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function SolkadhiCup({ width = "24", height = "24", className = "" }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <polygon points="5,4 19,4 16,21 8,21" fill="#FAF8F5" stroke="#1C1C1C" strokeWidth="2.5" />
      <line x1="5" y1="8" x2="19" y2="8" stroke="#C8102E" strokeWidth="2" />
      <path d="M11 12H13V17H11V12Z" fill="#C8102E" />
    </svg>
  );
}

export function VadaPavBurger({ width = "24", height = "24", className = "" }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Top Bun */}
      <path d="M3 11C3 7 7 6 12 6C17 6 21 7 21 11H3Z" fill="#FAF8F5" stroke="#1C1C1C" strokeWidth="2.5" />
      {/* Vada (center patty) */}
      <rect x="5" y="12" width="14" height="4" rx="2" fill="#C8102E" stroke="#1C1C1C" strokeWidth="2.5" />
      {/* Bottom Bun */}
      <rect x="3" y="17" width="18" height="3" fill="#FAF8F5" stroke="#1C1C1C" strokeWidth="2.5" />
    </svg>
  );
}

export function PizzaCutout({ width = "24", height = "24", className = "" }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <polygon points="12,2 21,18 3,18" fill="#FAF8F5" stroke="#1C1C1C" strokeWidth="2.5" />
      {/* Pepperoni dots */}
      <circle cx="12" cy="11" r="2" fill="#C8102E" />
      <circle cx="9" cy="15" r="1.5" fill="#1C1C1C" />
      <circle cx="15" cy="15" r="1.5" fill="#C8102E" />
      <path d="M3 18C8 20 16 20 21 18" stroke="#1C1C1C" strokeWidth="2" fill="none" />
    </svg>
  );
}

export function BiryaniPlate({ width = "24", height = "24", className = "" }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <ellipse cx="12" cy="14" rx="10" ry="6" fill="#FAF8F5" stroke="#1C1C1C" strokeWidth="2.5" />
      <ellipse cx="12" cy="14" rx="7" ry="3.5" fill="none" stroke="#C8102E" strokeWidth="1.5" />
      {/* Rice lines */}
      <line x1="8" y1="13" x2="11" y2="13" stroke="#1C1C1C" strokeWidth="2" />
      <line x1="13" y1="15" x2="16" y2="15" stroke="#1C1C1C" strokeWidth="2" />
      {/* Chicken leg */}
      <path d="M6 8L15 15" stroke="#C8102E" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function AvocadoCutout({ width = "24", height = "24", className = "" }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 2C8 2 5 7 5 13C5 18 8 21 12 21C16 21 19 18 19 13C19 7 16 2 12 2Z" fill="#FAF8F5" stroke="#1C1C1C" strokeWidth="2.5" />
      {/* Seed center */}
      <circle cx="12" cy="14" r="3.5" fill="#C8102E" stroke="#1C1C1C" strokeWidth="1.5" />
    </svg>
  );
}

export function LocationPin({ width = "24", height = "24", className = "", style = {} }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M12 2C7.5 2 4 5.5 4 10C4 16 12 22 12 22C12 22 20 16 20 10C20 5.5 16.5 2 12 2Z" fill="#FAF8F5" stroke="#1C1C1C" strokeWidth="2.5" />
      <circle cx="12" cy="10" r="3" fill="#C8102E" />
    </svg>
  );
}

export function WalletLedger({ width = "24", height = "24", className = "" }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="4" y="3" width="16" height="18" rx="1" fill="#FAF8F5" stroke="#1C1C1C" strokeWidth="2.5" />
      <line x1="8" y1="7" x2="16" y2="7" stroke="#C8102E" strokeWidth="2" />
      <line x1="8" y1="12" x2="16" y2="12" stroke="#1C1C1C" strokeWidth="1.5" />
      <line x1="8" y1="16" x2="14" y2="16" stroke="#1C1C1C" strokeWidth="1.5" />
    </svg>
  );
}

export function ClockLogistics({ width = "24", height = "24", className = "" }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="12" cy="12" r="9" fill="#FAF8F5" stroke="#1C1C1C" strokeWidth="2.5" />
      <line x1="12" y1="12" x2="12" y2="6" stroke="#C8102E" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="12" y1="12" x2="16" y2="12" stroke="#1C1C1C" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function SweetJalebi({ width = "24", height = "24", className = "" }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 12C9 12 8 10 9 8C10 6 13 6 15 8C17 10 16 14 12 15C8 16 5 13 6 9C7 5 12 3 17 5C22 7 21 14 16 18C11 22 5 21 2 15" stroke="#C8102E" strokeWidth="2.5" fill="none" />
      <circle cx="12" cy="12" r="1.5" fill="#1C1C1C" />
    </svg>
  );
}

export function SaladLeaf({ width = "24", height = "24", className = "" }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M2 21C2 15 7 11 12 11C17 11 22 15 22 21H2Z" fill="#FAF8F5" stroke="#1C1C1C" strokeWidth="2.5" />
      <path d="M12 11C12 7 14 3 12 2C10 3 12 7 12 11Z" fill="#C8102E" />
      <line x1="7" y1="15" x2="17" y2="15" stroke="#1C1C1C" strokeWidth="1.5" />
    </svg>
  );
}

export function JuiceGlass({ width = "24", height = "24", className = "" }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <polygon points="6,6 18,6 16,21 8,21" fill="#FAF8F5" stroke="#1C1C1C" strokeWidth="2.5" />
      <line x1="6" y1="10" x2="18" y2="10" stroke="#C8102E" strokeWidth="1.5" />
      {/* Straw */}
      <line x1="14" y1="11" x2="17" y2="2" stroke="#1C1C1C" strokeWidth="2" />
    </svg>
  );
}

export function KabobStick({ width = "24", height = "24", className = "" }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <line x1="3" y1="21" x2="21" y2="3" stroke="#1C1C1C" strokeWidth="2" />
      <rect x="7" y="11" width="4" height="4" fill="#C8102E" stroke="#1C1C1C" strokeWidth="1.5" transform="rotate(45 9 13)" />
      <rect x="12" y="6" width="4" height="4" fill="#FAF8F5" stroke="#1C1C1C" strokeWidth="1.5" transform="rotate(45 14 8)" />
    </svg>
  );
}

export function GeneralMeal({ width = "24", height = "24", className = "" }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="12" cy="12" r="9" fill="#FAF8F5" stroke="#1C1C1C" strokeWidth="2.5" />
      <line x1="6" y1="12" x2="18" y2="12" stroke="#C8102E" strokeWidth="1.5" />
      <circle cx="12" cy="7" r="1.5" fill="#1C1C1C" />
      <circle cx="12" cy="17" r="1.5" fill="#1C1C1C" />
    </svg>
  );
}

// Map text keys to actual components for dynamic rendering
export function getSVGIcon(name, width = "24", height = "24", className = "", style = {}) {
  const map = {
    "🌶️": MisalBowl,
    "🥣": MisalBowl,
    "🔥": MisalBowl,
    "🌋": MisalBowl,
    "🥥": SolkadhiCup,
    "🥛": SolkadhiCup,
    "🌀": SweetJalebi,
    "🟡": SweetJalebi,
    "🧁": SweetJalebi,
    "🍋": SolkadhiCup,
    "🥔": VadaPavBurger,
    "🍔": VadaPavBurger,
    "🧆": VadaPavBurger,
    "🍱": BiryaniPlate,
    "🍛": BiryaniPlate,
    "🥘": BiryaniPlate,
    "🫓": VadaPavBurger,
    "🍖": KabobStick,
    "🍗": KabobStick,
    "🍢": KabobStick,
    "🧀": GeneralMeal,
    "🥦": SaladLeaf,
    "🥑": AvocadoCutout,
    "🥗": SaladLeaf,
    "🍕": PizzaCutout,
    "🍝": PizzaCutout,
    "🍍": JuiceGlass,
    "🥭": JuiceGlass,
    "star": SovietStar,
    "gear": CanteenGear,
    "pin": LocationPin,
    "ledger": WalletLedger,
    "clock": ClockLogistics
  };

  const Component = map[name] || GeneralMeal;
  return <Component width={width} height={height} className={className} style={style} />;
}
