const fs = require('fs');

// Hero.tsx updates
let heroPath = 'src/components/common/Hero.tsx';
let heroData = fs.readFileSync(heroPath, 'utf8');
heroData = heroData.replace(/<ArrowRight size=\{20\} \/>/g, '<ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />');
fs.writeFileSync(heroPath, heroData);

// FleetShowcase.tsx updates (glare & stagger)
let fleetPath = 'src/components/home/FleetShowcase.tsx';
let fleetData = fs.readFileSync(fleetPath, 'utf8');
// Add glare
fleetData = fleetData.replace(/className="([^"]*ios-glass[^"]*)"/g, (match, p1) => {
    if (!p1.includes('ios-glare')) {
        return `className="${p1} ios-glare ios-glare-card group"`;
    }
    return match;
});
// Add stagger
fleetData = fleetData.replace(/className="flex items-center gap-2"/g, 'className="flex items-center gap-2 stagger-item stagger-1"');
fleetData = fleetData.replace(/className="flex items-center gap-2 text-sm"/g, 'className="flex items-center gap-2 text-sm stagger-item stagger-2"');
// Make sure arrow translates
fleetData = fleetData.replace(/<ArrowRight size=\{16\} \/>/g, '<ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />');
fs.writeFileSync(fleetPath, fleetData);

// ServicesSection.tsx updates (glare)
let servicesPath = 'src/components/home/ServicesSection.tsx';
if (fs.existsSync(servicesPath)) {
    let servicesData = fs.readFileSync(servicesPath, 'utf8');
    servicesData = servicesData.replace(/className="([^"]*ios-glass[^"]*)"/g, (match, p1) => {
        if (!p1.includes('ios-glare')) {
            return `className="${p1} ios-glare ios-glare-card group"`;
        }
        return match;
    });
    fs.writeFileSync(servicesPath, servicesData);
}

// Vehicle specs updates
let vsPath = 'src/components/fleet/vehicle/VehicleSpecs.tsx';
if (fs.existsSync(vsPath)) {
    let vsData = fs.readFileSync(vsPath, 'utf8');
    vsData = vsData.replace(/className="([^"]*ios-glass[^"]*)"/g, (match, p1) => {
        if (!p1.includes('ios-glare')) {
            return `className="${p1} ios-glare group"`; // Don't scale up the main specs card
        }
        return match;
    });
    fs.writeFileSync(vsPath, vsData);
}

console.log('Applied micro-animations to Hero, FleetShowcase, and ServicesSection');
