const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        // Check if it already exists to avoid duplicates
        const existing = await prisma.vehicle.findFirst({
            where: { name: 'GMC Yukon XL Premium' }
        });

        if (!existing) {
            const vehicle = await prisma.vehicle.create({
                data: {
                    name: 'GMC Yukon XL Premium',
                    image: '/images/fleet/gmc_yukon_premium.png',
                    passengers: 7,
                    luggage: 5,
                    features: ['Luxury Leather', 'Free WiFi', 'Premium Sound', 'Privacy Glass'],
                    price: 'SAR 450',
                    category: 'VIP',
                    isActive: true,
                },
            });
            console.log('Restored vehicle:', vehicle);
        } else {
            console.log('Vehicle already exists.');
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
