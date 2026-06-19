import { PrismaClient } from '../src/generated/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

// Load environment variables so we have access to process.env.DATABASE_URL
dotenv.config();

// 1. Set up the pg connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);

// 2. Instantiate PrismaClient with the required adapter
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash('admin@123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      email: 'admin@gmail.com',
      passwordHash: hashedPassword,
      firstName: 'System',
      lastName: 'Admin',
      phoneNumber: '000-000-0000',
      dateOfBirth: new Date('1990-01-01'),
      role: 'ADMIN',
    },
  });

  console.log('✅ Successfully seeded Admin account:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    // Close the postgres pool so the script exits cleanly
    await pool.end();
  });
