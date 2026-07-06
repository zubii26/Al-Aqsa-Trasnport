const fs = require('fs');
const file = 'src/app/(public)/booking/page.tsx';
let code = fs.readFileSync(file, 'utf8');

// 1. Add imports
const importsToAdd = `import BookingHeader from '@/components/booking/BookingHeader';
import BookingFooter from '@/components/booking/BookingFooter';
import TrustBadges from '@/components/booking/TrustBadges';
import VehicleCategoryFilter from '@/components/booking/VehicleCategoryFilter';
`;
code = code.replace(/(import dynamic from 'next\/dynamic';)/, '$1\n' + importsToAdd);

// 2. Wrap layout in grid and remove default layout stuff
code = code.replace(/<main className=\"min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 font-sans\">/, '<main className=\"min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 font-sans\">\n            <BookingHeader />');
code = code.replace(/<div className=\"container mx-auto px-4 mt-8 pb-28 md:pb-8\" ref={wizardRef}>\s*<div className=\"mb-6\">\s*<Breadcrumbs \/>\s*<\/div>/, '<div className=\"container mx-auto px-4 mt-8 pb-28 md:pb-8\" ref={wizardRef}>\n                <div className=\"mb-6\">\n                    <Breadcrumbs />\n                </div>\n                <div className=\"max-w-6xl mx-auto grid lg:grid-cols-3 gap-12\">');

// 3. Add closing tags for the grid and BookingFooter
code = code.replace(/<\/div>\s*<\/main>/, '</div>\n                </div>\n            </div>\n            <BookingFooter />\n        </main>');

// 4. Update the sidebar area
const oldSidebar = /\{\/\* Sidebar \*\/\}\s*<div className=\"hidden lg:block h-full relative\">\s*\{step < 5 && <Sidebar \/>\}\s*<\/div>/;
const newSidebar = `{/* Sidebar */}
                    <div className=\"hidden lg:block\">
                        {step < 5 && (
                            <div className=\"sticky top-32 space-y-6 pb-10\">
                                <Sidebar />
                            </div>
                        )}
                    </div>`;
code = code.replace(oldSidebar, newSidebar);

// 5. Wrap the main step content in a col-span-2 div
code = code.replace(/\{\/\* Main Form Area \*\/\}\s*<div className=\"flex-1\">/, '{/* Main Form Area */}\n                    <div className=\"lg:col-span-2\">');

// 6. Hide flight number if not airport route
const flightNumOld = /Flight Number \{isAirportRoute \? '\*' : ''\}[\s\S]*?\{\s*errors\.flightNumber/m;
if(code.match(flightNumOld)) {
    code = code.replace(/(\{\/\* Flight Details \*\/\})\s*<div className=\"relative group col-span-2\">([\s\S]*?)\{errors\.flightNumber([^}]*)\}\s*<\/div>/m, 
    `$1\n                    {isAirportRoute && (\n                        <div className=\"relative group col-span-2\">$2{errors.flightNumber$3}\n                        </div>\n                    )}`);
}

// 7. Inject TrustBadges in renderStep1
code = code.replace(/(<p className=\"text-slate-500 text-lg\">[^<]*<\/p>\s*<\/div>)/, '$1\n\n                <TrustBadges />');

// 8. Add VehicleCategoryFilter in step 2
code = code.replace(/(<h2 className=\"text-3xl font-bold text-slate-900 dark:text-white mb-2\">Choose Your Vehicle<\/h2>[\s\S]*?<p className=\"text-slate-500 text-lg\">Select the perfect ride for your journey<\/p>\s*<\/div>)/, 
    `$1\n\n                <VehicleCategoryFilter />`);

// 9. Fix renderVehicleCard - read from scratch
const vehicleCardNew = fs.readFileSync('C:/Users/zubii/.gemini/antigravity/brain/ee2cb7b9-5070-492f-920a-fba3519b2ecd/scratch/renderVehicleCard.ts', 'utf8');
const regexCard = /const renderVehicleCard = \(vehicle: any, legId\?: string\) => \{[\s\S]*?^\s*\};\s*$/m;
code = code.replace(regexCard, vehicleCardNew.trim());

fs.writeFileSync(file, code);
console.log('Restored modifications');
