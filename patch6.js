const fs = require('fs');
const filePath = 'src/services/InvoiceGenerator.ts';
let code = fs.readFileSync(filePath, 'utf-8');

const oldBlock = `    const tableData = [
        [
            booking.vehicle || 'Umrah Transport',
            \`\${booking.pickup} -> \${booking.dropoff}\`,
            \`Date: \${new Date(booking.date).toLocaleDateString()} \${booking.time || ''}\\nRef: \${booking._id?.slice(-6)}\`, // Details
            \`SAR \${booking.finalPrice}\` // Amount
        ]
    ];`;

const newBlock = `    let tableData = [];
    if (booking.legs && booking.legs.length > 0) {
        tableData = booking.legs.map((leg: any, index: number) => {
            const dateStr = leg.date ? new Date(leg.date).toLocaleDateString() : 'N/A';
            return [
                \`Route \${index + 1}\`,
                \`\${leg.pickup || 'Unknown'} -> \${leg.dropoff || 'Unknown'}\`,
                \`Date: \${dateStr} \${leg.time || ''}\\nRef: \${booking._id?.slice(-6)}\`,
                index === 0 ? \`SAR \${booking.finalPrice}\` : '-'
            ];
        });
    } else {
        tableData = [
            [
                booking.vehicle || 'Umrah Transport',
                \`\${booking.pickup} -> \${booking.dropoff}\`,
                \`Date: \${new Date(booking.date).toLocaleDateString()} \${booking.time || ''}\\nRef: \${booking._id?.slice(-6)}\`, // Details
                \`SAR \${booking.finalPrice}\` // Amount
            ]
        ];
    }`;

if (!code.includes(oldBlock)) {
    console.log("Error finding block");
} else {
    code = code.replace(oldBlock, newBlock);
    fs.writeFileSync(filePath, code, 'utf-8');
    console.log("Phase 6 Patch complete");
}
