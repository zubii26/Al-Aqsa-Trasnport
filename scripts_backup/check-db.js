const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Helper to load env manually
const loadEnv = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            console.log(`Loading ${filePath}...`);
            let content = fs.readFileSync(filePath);

            let text;
            if (content[0] === 0xFF && content[1] === 0xFE) {
                text = content.toString('utf16le');
            } else if (content.indexOf('\0') !== -1) {
                text = content.toString('utf16le');
            } else {
                text = content.toString('utf8');
            }

            text.split(/\r?\n/).forEach(line => {
                const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
                if (match) {
                    const key = match[1].trim();
                    const value = match[2] ? match[2].trim().replace(/^["']|["']$/g, '') : '';
                    if (!process.env[key]) {
                        process.env[key] = value;
                    }
                }
            });
        }
    } catch (e) {
        console.error(`Error loading ${filePath}:`, e);
    }
};

const envLocalPath = path.resolve(__dirname, '../.env.local');
loadEnv(envLocalPath);

const MONGODB_URI = process.env.MONGODB_URI;
console.log('URI:', MONGODB_URI ? MONGODB_URI.replace(/:([^:@]+)@/, ':****@') : 'Undefined');

if (!MONGODB_URI) {
    console.error('MONGODB_URI is missing!');
    process.exit(1);
}

(async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Successfully connected to MongoDB!');
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Connection failed:', error.message);
        if (error.cause) console.error('Cause:', error.cause);
        process.exit(1);
    }
})();
