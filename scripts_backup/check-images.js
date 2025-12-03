const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Helper to load env manually
const loadEnv = (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
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

const VehicleSchema = new mongoose.Schema({
    name: String,
    image: String,
});
const Vehicle = mongoose.model('Vehicle', VehicleSchema);

(async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        const vehicles = await Vehicle.find({});
        console.log('Vehicles found:', vehicles.length);
        vehicles.forEach(v => {
            console.log(`Name: ${v.name}, Image: ${v.image}`);
        });
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
})();
