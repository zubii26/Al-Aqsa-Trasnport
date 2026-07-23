/**
 * PDPL Compliance Script: Anonymize Old Bookings
 * Run with: node scripts/anonymize-bookings.mjs [--dry-run]
 *
 * Anonymizes PII (name, email, phone, flight details) for bookings 
 * that are 'completed' or 'cancelled' and older than 12 months.
 * Preserves financial, route, and vehicle metadata.
 */

import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is not set in .env.local');
  process.exit(1);
}

// Minimal schema for anonymization
const BookingSchema = new mongoose.Schema({
  status: String,
  createdAt: Date,
  name: String,
  email: String,
  phone: String,
  flightNumber: String,
  pickup: String,
  dropoff: String,
  notes: String,
  review: String,
  country: String,
}, { strict: false });

async function main() {
  const isDryRun = process.argv.includes('--dry-run');
  console.log(`\n[anonymize-bookings] Connecting to MongoDB... ${isDryRun ? '(DRY RUN)' : ''}`);
  
  await mongoose.connect(MONGODB_URI);
  const Booking = mongoose.model('Booking', BookingSchema);

  // 12 months ago
  const oneYearAgo = new Date();
  oneYearAgo.setMonth(oneYearAgo.getMonth() - 12);

  const filter = {
    status: { $in: ['completed', 'cancelled'] },
    createdAt: { $lt: oneYearAgo },
    // Only target records that haven't been anonymized yet
    email: { $ne: 'anonymized@redacted.local' }
  };

  const bookingsToAnonymize = await Booking.find(filter);

  console.log(`Found ${bookingsToAnonymize.length} bookings older than 12 months requiring anonymization.\n`);

  if (isDryRun) {
    console.log('[DRY RUN] Would anonymize the following IDs:');
    bookingsToAnonymize.forEach(b => console.log(`  - ${b._id} (${b.createdAt?.toISOString().split('T')[0]})`));
    console.log('\n[DRY RUN] No data was modified.');
  } else {
    let count = 0;
    for (const booking of bookingsToAnonymize) {
      booking.name = '[Redacted]';
      booking.email = 'anonymized@redacted.local';
      booking.phone = '0000000000';
      
      if (booking.flightNumber) booking.flightNumber = '[Redacted]';
      if (booking.notes) booking.notes = '[Redacted]';
      if (booking.review) booking.review = '[Redacted]';
      
      await booking.save();
      count++;
    }
    console.log(`[SUCCESS] Successfully anonymized ${count} bookings.`);
  }

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('[anonymize-bookings] Error:', err.message);
  process.exit(1);
});
