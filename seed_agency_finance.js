
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env.local');
    process.exit(1);
}

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const walletSchema = new mongoose.Schema({
    agencyId: String,
    balance: Number,
    creditLimit: Number,
    currency: String,
    isActive: Boolean,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const invoiceSchema = new mongoose.Schema({
    agencyId: String,
    invoiceNumber: String,
    periodStart: Date,
    periodEnd: Date,
    dueDate: Date,
    totalAmount: Number,
    status: String,
    paidAmount: Number,
    items: Array,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
const AgencyWallet = mongoose.models.AgencyWallet || mongoose.model('AgencyWallet', walletSchema);
const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Create Test Agency
        const agencyEmail = 'test@agency.com';
        let agency = await User.findOne({ email: agencyEmail });

        if (!agency) {
            agency = await User.create({
                name: 'Test Setup Agency',
                email: agencyEmail,
                role: 'agency',
            });
            console.log('Created Agency:', agency._id);
        } else {
            console.log('Agency already exists:', agency._id);
        }

        // Create/Update Wallet
        let wallet = await AgencyWallet.findOne({ agencyId: agency._id });
        if (!wallet) {
            wallet = await AgencyWallet.create({
                agencyId: agency._id,
                balance: -5000, // Debit balance
                creditLimit: 10000,
                currency: 'SAR',
                isActive: true,
            });
            console.log('Created Wallet');
        } else {
            // Reset balance for testing
            wallet.balance = -5000;
            await wallet.save();
            console.log('Reset Wallet Balance');
        }

        // Create Overdue Invoice
        const overdueInvoice = await Invoice.create({
            agencyId: agency._id,
            invoiceNumber: 'INV-001-OVERDUE',
            periodStart: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000), // 40 days ago
            periodEnd: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
            dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago (OVERDUE)
            totalAmount: 2000,
            paidAmount: 0,
            status: 'ISSUED', // Valid status for overdue check
            items: [{ description: 'Transport Services', amount: 2000, date: new Date() }]
        });
        console.log('Created Overdue Invoice:', overdueInvoice._id);

        // Create Unpaid Invoice (Not Overdue)
        const openInvoice = await Invoice.create({
            agencyId: agency._id,
            invoiceNumber: 'INV-002-OPEN',
            periodStart: new Date(),
            periodEnd: new Date(),
            dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // Due in 15 days
            totalAmount: 3000,
            paidAmount: 0,
            status: 'ISSUED',
            items: [{ description: 'Transport Services', amount: 3000, date: new Date() }]
        });
        console.log('Created Open Invoice:', openInvoice._id);

        console.log('Seeding Complete');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
    }
}

seed();
