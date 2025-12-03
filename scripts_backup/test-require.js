const path = require('path');
const fs = require('fs');

const prismaPath = path.join(process.cwd(), 'node_modules/.prisma/client/index.js');
console.log('Path:', prismaPath);
console.log('Exists:', fs.existsSync(prismaPath));

try {
    const { PrismaClient } = require(prismaPath);
    console.log('Success!');
    const prisma = new PrismaClient();
    console.log('Prisma initialized');
} catch (e) {
    console.error('Error:', e);
}
