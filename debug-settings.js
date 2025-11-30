
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
    const settings = await prisma.settings.findMany();
    fs.writeFileSync('settings_clean.json', JSON.stringify(settings, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
