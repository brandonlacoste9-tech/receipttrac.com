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

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log('Existing Users:', users.map(u => ({ id: u.id, email: u.email, name: u.name })));
  } catch (error) {
    console.error('Database query failed:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
