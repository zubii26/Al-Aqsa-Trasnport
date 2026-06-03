const fs = require('fs');

const files = [
    'src/components/fleet/vehicle/VehicleSpecs.tsx',
    'src/components/fleet/vehicle/VehicleHero.tsx',
    'src/components/fleet/vehicle/VehicleGallery.tsx',
    'src/app/admin/dashboard/page.tsx',
    'src/app/admin/bookings/page.tsx',
    'src/app/admin/vehicles/page.tsx',
    'src/app/admin/routes/page.tsx',
    'src/app/admin/settings/page.tsx',
    'src/app/admin/layout.tsx',
    'src/app/admin/page.tsx'
];

const icons = [
    'CheckCircle', 'ArrowRight', 'Calendar', 'Clock', 'User', 'Mail', 'Phone', 'MapPin', 
    'ChevronDown', 'Info', 'ShieldCheck', 'Headphones', 'Briefcase', 'Navigation', 
    'Building2', 'Globe', 'PlaneLanding', 'PlaneTakeoff', 'Users', 'Luggage', 
    'HeartHandshake', 'Car', 'Star', 'Shield', 'Gem', 'ArrowUpRight', 'ArrowLeft', 
    'MessageSquare', 'Send', 'ThumbsUp', 'Award', 'Menu', 'X',
    'Check', 'AlertCircle', 'Search', 'Filter', 'Plus', 'Edit', 'Trash2', 'Settings',
    'LayoutDashboard', 'BookOpen', 'Map', 'MoreVertical', 'Download', 'Upload', 'Eye'
];

for (const file of files) {
    if (!fs.existsSync(file)) {
        console.log('Skipping ' + file + ', not found');
        continue;
    }
    let content = fs.readFileSync(file, 'utf8');

    icons.forEach(icon => {
        const regex = new RegExp(`<${icon}\\b(?!.*strokeWidth)([^>]*)>`, 'g');
        content = content.replace(regex, `<${icon} strokeWidth={1.25}$1>`);
    });

    content = content.replace(/bg-slate-50\/50 dark:bg-slate-900\/30 rounded-2xl/g, 'ios-glass rounded-[32px]');
    content = content.replace(/glass-card/g, 'ios-glass');
    content = content.replace(/rounded-3xl/g, 'rounded-[32px]');
    content = content.replace(/bg-white\/80 dark:bg-slate-900\/50/g, 'ios-glass');
    content = content.replace(/bg-white\/90 dark:bg-slate-900\/90/g, 'ios-glass');
    content = content.replace(/font-playfair/g, ''); // Ensure no playfair serif font is used
    
    fs.writeFileSync(file, content);
    console.log('Updated ' + file);
}
