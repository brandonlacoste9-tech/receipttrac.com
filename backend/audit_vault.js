import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import pgPkg from 'pg';
const { Pool } = pgPkg;
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        created_at: true,
      }
    });
    console.log('--- Sovereign Vault User List ---');
    console.table(users);
    
    const authenticators = await prisma.authenticator.findMany({
      select: {
        id: true,
        user_id: true,
        credentialDeviceType: true,
      }
    });
    console.log('\n--- Active Biometric Credentials ---');
    console.table(authenticators);

  } catch (e) {
    console.error('Failed to audit vault:', e);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
