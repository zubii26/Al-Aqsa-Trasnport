const fs = require('fs');
const path = require('path');

// 1. Update VehicleSelector.module.css
let vsCssPath = 'src/components/home/VehicleSelector.module.css';
let vsCss = fs.readFileSync(vsCssPath, 'utf8');

vsCss = vsCss.replace(/\.selected \{(?:[^}]*)\}/, `.selected {
    background: linear-gradient(145deg, rgba(212, 175, 55, 0.05), rgba(212, 175, 55, 0.02));
    border-color: rgba(212, 175, 55, 0.5);
    box-shadow: 
        0 4px 20px -2px rgba(212, 175, 55, 0.1),
        inset 0 0 0 1px rgba(212, 175, 55, 0.1);
}`);

vsCss = vsCss.replace(/\.selected \.iconWrapper \{(?:[^}]*)\}/, `.selected .iconWrapper {
    background: rgba(212, 175, 55, 0.1);
    color: #D4AF37;
    border-color: rgba(212, 175, 55, 0.2);
    box-shadow: none;
}`);

vsCss = vsCss.replace(/\.activeBorder \{(?:[^}]*)\}/, `.activeBorder {
    position: absolute;
    inset: 0;
    border: 1.5px solid #D4AF37;
    border-radius: 1.25rem;
    pointer-events: none;
    z-index: 2;
    opacity: 1;
}`);

vsCss = vsCss.replace(/\.checkIcon \{(?:[^}]*)\}/, `.checkIcon {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    color: #D4AF37;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    box-shadow: none;
}`);

fs.writeFileSync(vsCssPath, vsCss);

// 2. Update InstantPriceCalculator.module.css
let ipcCssPath = 'src/components/home/InstantPriceCalculator.module.css';
let ipcCss = fs.readFileSync(ipcCssPath, 'utf8');

ipcCss = ipcCss.replace(/background: linear-gradient\(145deg, #0f172a, #1e293b\);/, `background: linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.85));\n    backdrop-filter: blur(24px);\n    -webkit-backdrop-filter: blur(24px);`);
ipcCss = ipcCss.replace(/border-radius: 28px;/, 'border-radius: 32px;');

ipcCss = ipcCss.replace(/\.resultDisplay::before \{(?:[^}]*)\}/, `.resultDisplay::before {
    content: '';
    position: absolute;
    top: 0;
    left: 20%;
    right: 20%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.6), transparent);
    box-shadow: 0 2px 20px 2px rgba(212, 175, 55, 0.4);
}`);

ipcCss = ipcCss.replace(/letter-spacing: 0\.05em;/g, 'letter-spacing: 0.02em;');
fs.writeFileSync(ipcCssPath, ipcCss);


// 3. Update VehicleSelector.tsx
let vsTsxPath = 'src/components/home/VehicleSelector.tsx';
let vsTsx = fs.readFileSync(vsTsxPath, 'utf8');
vsTsx = vsTsx.replace(/<Users size=\{12\} \/>/g, '<Users size={12} strokeWidth={1.25} />');
vsTsx = vsTsx.replace(/<Briefcase size=\{12\} \/>/g, '<Briefcase size={12} strokeWidth={1.25} />');
vsTsx = vsTsx.replace(/<CheckCircle2 size=\{16\} \/>/g, '<CheckCircle2 size={20} strokeWidth={1.25} className="text-amber-500 fill-amber-500/10" />');
vsTsx = vsTsx.replace(/<Icon size=\{28\} /g, '<Icon size={28} strokeWidth={1.25} ');
fs.writeFileSync(vsTsxPath, vsTsx);

// 4. Update RouteSelector.module.css
let rsCssPath = 'src/components/home/RouteSelector.module.css';
if (fs.existsSync(rsCssPath)) {
    let rsCss = fs.readFileSync(rsCssPath, 'utf8');
    rsCss = rsCss.replace(/\.trigger \{(?:[^}]*)\}/, `.trigger {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
    text-align: left;
    box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.03);
}`);
    fs.writeFileSync(rsCssPath, rsCss);
}

// 5. Update RouteSelector.tsx icons
let rsTsxPath = 'src/components/home/RouteSelector.tsx';
if (fs.existsSync(rsTsxPath)) {
    let rsTsx = fs.readFileSync(rsTsxPath, 'utf8');
    rsTsx = rsTsx.replace(/<MapPin size=\{20\} \/>/g, '<MapPin size={20} strokeWidth={1.25} />');
    rsTsx = rsTsx.replace(/<Navigation size=\{20\} \/>/g, '<Navigation size={20} strokeWidth={1.25} />');
    fs.writeFileSync(rsTsxPath, rsTsx);
}

console.log('Applied iOS styles to Calculator');
