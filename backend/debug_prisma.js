
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import pgPkg from 'pg';
const { Pool } = pgPkg;
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function testPrisma() {
  try {
    const user = await prisma.user.create({
      data: {
        email: `tester_${Date.now()}@test.com`,
        password_hash: 'hash',
        name: 'Tester'
      }
    });
    console.log('User created:', user.id);
    
    const vault = await prisma.vault.create({
      data: {
        name: 'Test Vault',
        members: {
          create: {
            user_id: user.id,
            role: 'OWNER'
          }
        }
      }
    });
    console.log('Vault created:', vault.id);
  } catch (err) {
    console.error('PRISMA ERROR:', err);
  } finally {
    await prisma.$disconnect();
  }
}

testPrisma();
