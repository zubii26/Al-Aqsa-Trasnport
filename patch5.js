const fs = require('fs');
const filePath = 'src/app/(public)/booking/page.tsx';
let code = fs.readFileSync(filePath, 'utf-8');

const startIndex = code.indexOf('body: JSON.stringify({');
if (startIndex === -1) {
    console.log("Could not find start index");
    process.exit(1);
}

const endIndex = code.indexOf('}),', startIndex);
if (endIndex === -1) {
    console.log("Could not find end index");
    process.exit(1);
}

const replacement = `body: JSON.stringify({
                            name: bookingData.name,
                            email: bookingData.email,
                            phone: bookingData.phone,
                            pickup: legs[0]?.pickup || bookingData.pickup,
                            dropoff: legs[0]?.dropoff || bookingData.dropoff,
                            passengers: bookingData.passengers,
                            luggage: bookingData.luggage,
                            date: legs[0]?.date ? \`\${new Date(legs[0].date).getFullYear()}-\${String(new Date(legs[0].date).getMonth() + 1).padStart(2, '0')}-\${String(new Date(legs[0].date).getDate()).padStart(2, '0')}\` : undefined,
                            time: legs[0]?.time ? \`\${String(new Date(legs[0].time).getHours()).padStart(2, '0')}:\${String(new Date(legs[0].time).getMinutes()).padStart(2, '0')}\` : undefined,
                            country: bookingData.country,
                            flightNumber: bookingData.flightNumber,
                            arrivalDate: bookingData.arrivalDate ? \`\${bookingData.arrivalDate.getFullYear()}-\${String(bookingData.arrivalDate.getMonth() + 1).padStart(2, '0')}-\${String(bookingData.arrivalDate.getDate()).padStart(2, '0')}\` : undefined,
                            selectedVehicles: bookingData.selectedVehicles,
                            status: 'pending',
                            routeId: legs[0]?.routeId === 'custom' ? 'custom' : legs[0]?.routeId || bookingData.routeId,
                            customRoute: legs[0]?.routeId === 'custom' ? bookingData.customRoute : undefined,
                            legs: legs.map(l => ({
                                id: l.id,
                                routeId: l.routeId,
                                pickup: l.pickup,
                                dropoff: l.dropoff,
                                date: l.date ? \`\${new Date(l.date).getFullYear()}-\${String(new Date(l.date).getMonth() + 1).padStart(2, '0')}-\${String(new Date(l.date).getDate()).padStart(2, '0')}\` : null,
                                time: l.time ? \`\${String(new Date(l.time).getHours()).padStart(2, '0')}:\${String(new Date(l.time).getMinutes()).padStart(2, '0')}\` : null
                            }))
                        }),`;

code = code.substring(0, startIndex) + replacement + code.substring(endIndex + 3);
fs.writeFileSync(filePath, code, 'utf-8');
console.log("Phase 5 Patch complete");
