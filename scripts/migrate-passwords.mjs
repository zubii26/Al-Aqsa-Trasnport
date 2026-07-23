/**
 * DB Script: Migrate Plaintext Passwords to bcrypt
 * Run with: node scripts/migrate-passwords.mjs
 */

import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env.local') });

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
  console.log('\n[migrate-passwords] Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);

  const User = mongoose.model('User', UserSchema);
  const users = await User.find({});
  let migratedCount = 0;

  for (const user of users) {
    if (user.password && !user.password.startsWith('$2a$') && !user.password.startsWith('$2b$')) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      user.password = hashedPassword;
      await user.save();
      migratedCount++;
      console.log(`Migrated user: ${user.email}`);
    }
  }

  console.log(`\nSuccessfully migrated ${migratedCount} users.`);
  await mongoose.disconnect();
}

main().catch(err => {
  console.error('[migrate-passwords] Error:', err.message);
  process.exit(1);
});
