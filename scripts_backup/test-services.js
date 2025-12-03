const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://transport-admin:transport123@transport-cluster.mongodb.net/transport-db?retryWrites=true&w=majority';

// Define minimal schemas for testing if models are not available in this context
// But we can try to require the models if we use ts-node or just define them inline for this test script to be standalone.
// To be safe and avoid TS issues, I'll define minimal models here using mongoose.

const RouteSchema = new mongoose.Schema({
    origin: String,
    destination: String,
    category: String,
    isActive: Boolean
});
const Route = mongoose.models.Route || mongoose.model('Route', RouteSchema);

const RoutePriceSchema = new mongoose.Schema({
    route: String,
    vehicle: String,
    price: Number
});
const RoutePrice = mongoose.models.RoutePrice || mongoose.model('RoutePrice', RoutePriceSchema);

const BookingSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    pickup: String,
    dropoff: String,
    date: String,
    time: String,
    vehicle: String,
    passengers: Number,
    status: String
});
const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);

const ReviewSchema = new mongoose.Schema({
    name: String,
    rating: Number,
    comment: String,
    date: String,
    source: String,
    isActive: Boolean
});
const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

async function testServices() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected!');

        // 1. Test Route Creation
        console.log('Testing Route creation...');
        const route = await Route.create({
            origin: 'Test Origin',
            destination: 'Test Dest',
            category: 'Test',
            isActive: true
        });
        console.log('Route created:', route._id);

        // 2. Test Price Creation
        console.log('Testing Price creation...');
        const price = await RoutePrice.create({
            route: route._id.toString(),
            vehicle: 'test-vehicle-id',
            price: 100
        });
        console.log('Price created:', price._id);

        // 3. Test Booking Creation
        console.log('Testing Booking creation...');
        const booking = await Booking.create({
            name: 'Test User',
            email: 'test@example.com',
            phone: '1234567890',
            pickup: 'Test Pickup',
            dropoff: 'Test Dropoff',
            date: '2024-01-01',
            time: '12:00',
            vehicle: 'Test Vehicle',
            passengers: 2,
            status: 'pending'
        });
        console.log('Booking created:', booking._id);

        // 4. Test Review Creation
        console.log('Testing Review creation...');
        const review = await Review.create({
            name: 'Test Reviewer',
            rating: 5,
            comment: 'Great service',
            date: '2024-01-01',
            source: 'website',
            isActive: true
        });
        console.log('Review created:', review._id);

        // 5. Cleanup
        console.log('Cleaning up...');
        await Route.findByIdAndDelete(route._id);
        await RoutePrice.findByIdAndDelete(price._id);
        await Booking.findByIdAndDelete(booking._id);
        await Review.findByIdAndDelete(review._id);
        console.log('Cleanup complete.');

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

testServices();
