const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src/app/globals.css');
const cssToAdd = `
/* =========================================
   IOS MICRO-ANIMATIONS & DYNAMICS
   ========================================= */

.ios-shimmer-btn {
  position: relative;
  overflow: hidden;
}

.ios-shimmer-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    to right,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.4) 50%,
    rgba(255,255,255,0) 100%
  );
  transform: skewX(-20deg);
  transition: none;
}

.ios-shimmer-btn:hover::after {
  animation: ios-shimmer-sweep 0.7s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
}

@keyframes ios-shimmer-sweep {
  100% { left: 200%; }
}

.ios-glare {
  position: relative;
  overflow: hidden;
}

.ios-glare::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 20%,
    rgba(255,255,255,0.2) 25%,
    transparent 30%
  );
  transform: translateX(-150%);
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
  z-index: 10;
  border-radius: inherit;
}

.ios-glare:hover::before {
  transform: translateX(150%);
}

.ios-glare-card {
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.ios-glare-card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2);
}

.stagger-item {
  transform: translateY(8px);
  opacity: 0.8;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
}

.group:hover .stagger-1 { transition-delay: 50ms; transform: translateY(0); opacity: 1; }
.group:hover .stagger-2 { transition-delay: 100ms; transform: translateY(0); opacity: 1; }
.group:hover .stagger-3 { transition-delay: 150ms; transform: translateY(0); opacity: 1; }
`;

fs.appendFileSync(cssPath, cssToAdd);
console.log('Added iOS micro-animations to globals.css');
