const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Create Boss Admin
    const admin = await prisma.user.upsert({
        where: { email: 'meharzubair703@gmail.com' },
        update: {},
        create: {
            name: 'Boss Admin',
            email: 'meharzubair703@gmail.com',
            password: 'admin123', // In production, hash this!
            role: 'ADMIN',
        },
    });

    // Create Manager
    const manager = await prisma.user.upsert({
        where: { email: 'meharzubair@gmail.com' },
        update: {},
        create: {
            name: 'Operations Manager',
            email: 'meharzubair@gmail.com',
            password: 'admin1234', // In production, hash this!
            role: 'MANAGER',
        },
    });

    console.log({ admin, manager });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
