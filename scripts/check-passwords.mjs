/**
 * DB Diagnostic: User Password State
 * Run with: node scripts/check-passwords.mjs
 *
 * Reads MONGODB_URI from .env.local via dotenv.
 * Does NOT modify any data.
 */

import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env.local') });

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is not set in .env.local');
  process.exit(1);
}

const UserSchema = new mongoose.Schema({
  email: String,
  name: String,
  role: String,
  password: String,
  createdAt: Date,
}, { timestamps: true });

async function main() {
  console.log('\n[check-passwords] Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);

  const User = mongoose.model('User', UserSchema);
  const users = await User.find({}).select('email name role password createdAt').lean();

  console.log(`\nTotal user accounts found: ${users.length}`);
  console.log('-'.repeat(70));

  let bcryptCount = 0;
  let plaintextCount = 0;
  let noPasswordCount = 0;

  for (const u of users) {
    const hasBcrypt = u.password && (u.password.startsWith('$2a$') || u.password.startsWith('$2b$'));
    const hasPassword = !!u.password;
    
    if (!hasPassword) noPasswordCount++;
    else if (hasBcrypt) bcryptCount++;
    else plaintextCount++;

    const status = !hasPassword ? 'NO PASSWORD' : hasBcrypt ? 'bcrypt OK ' : 'PLAINTEXT ';
    const created = u.createdAt ? new Date(u.createdAt).toISOString().split('T')[0] : 'unknown';
    
    console.log(`  [${status}] | role: ${(u.role || 'user').padEnd(22)} | created: ${created} | ${u.email}`);
  }

  console.log('-'.repeat(70));
  console.log(`\nSummary:`);
  console.log(`  bcrypt hashed : ${bcryptCount}`);
  console.log(`  PLAINTEXT     : ${plaintextCount}  <-- MUST MIGRATE BEFORE REMOVING FALLBACK`);
  console.log(`  no password   : ${noPasswordCount}`);

  if (plaintextCount > 0) {
    console.log('\n[ACTION REQUIRED] Run POST /api/auth/migrate-passwords before removing the plaintext fallback.');
    console.log('After migration, run this script again and confirm PLAINTEXT count = 0.');
  } else {
    console.log('\n[CLEAR] All passwords are bcrypt hashed. Safe to remove the plaintext fallback.');
  }

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('[check-passwords] Error:', err.message);
  process.exit(1);
});
