/**
 * Backfill pickupDateTime for existing bookings
 * Run with: node scripts/backfill-pickup-datetime.mjs [--dry-run]
 *
 * The date (YYYY-MM-DD) and time (HH:mm) are assumed to be in Asia/Riyadh (UTC+3)
 * because that is where the physical operation happens.
 * 
 * E.g., Date: 2024-05-10, Time: 14:00 (Riyadh Time)
 * -> UTC representation: 2024-05-10T11:00:00Z
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

// Minimal schema
const BookingSchema = new mongoose.Schema({
  date: String,
  time: String,
  pickupDateTime: Date,
}, { strict: false });

function parseRiyadhTimeToUTC(dateStr, timeStr) {
  if (!dateStr) return null;
  
  // Format: YYYY-MM-DD
  const [year, month, day] = dateStr.split('-').map(Number);
  
  let hours = 0, minutes = 0;
  if (timeStr) {
      // Handles HH:mm or HH:mm:ss
      const parts = timeStr.split(':').map(Number);
      hours = parts[0] || 0;
      minutes = parts[1] || 0;
  }
  
  // Create date in UTC
  // We want to construct the exact moment.
  // Riyadh is always UTC+3 (no DST).
  // So if it's 14:00 Riyadh, it is 11:00 UTC.
  const utcHours = hours - 3;
  
  // Date.UTC handles negative hours by wrapping to the previous day correctly
  const utcDate = new Date(Date.UTC(year, month - 1, day, utcHours, minutes, 0));
  
  // Return a valid Date object or null if it failed
  if (isNaN(utcDate.getTime())) return null;
  return utcDate;
}

async function main() {
  const isDryRun = process.argv.includes('--dry-run');
  console.log(`\n[backfill] Connecting to MongoDB... ${isDryRun ? '(DRY RUN)' : ''}`);
  
  await mongoose.connect(MONGODB_URI);
  const Booking = mongoose.model('Booking', BookingSchema);

  // Find bookings without pickupDateTime
  const filter = {
    pickupDateTime: { $exists: false },
    date: { $exists: true, $ne: null }
  };

  const bookingsToBackfill = await Booking.find(filter);
  console.log(`Found ${bookingsToBackfill.length} bookings missing pickupDateTime.\n`);

  let successCount = 0;
  let skipCount = 0;

  for (const booking of bookingsToBackfill) {
      const { date, time } = booking;
      const parsedUtcDate = parseRiyadhTimeToUTC(date, time);
      
      if (!parsedUtcDate) {
          skipCount++;
          if (isDryRun) {
            console.log(`  - [SKIP] ID: ${booking._id} | Unparseable date/time: "${date}" / "${time}"`);
          }
          continue;
      }
      
      if (isDryRun) {
          // Verify
          console.log(`  - [DRY RUN] ID: ${booking._id}`);
          console.log(`      Source: date="${date}", time="${time}"`);
          console.log(`      Result: pickupDateTime=${parsedUtcDate.toISOString()}`);
      } else {
          booking.pickupDateTime = parsedUtcDate;
          await booking.save();
          successCount++;
      }
  }

  if (isDryRun) {
      console.log(`\n[DRY RUN] Would update ${bookingsToBackfill.length - skipCount} records.`);
  } else {
      console.log(`\n[SUCCESS] Successfully backfilled ${successCount} bookings (${skipCount} skipped due to bad data).`);
  }

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('[backfill] Error:', err.message);
  process.exit(1);
});
