import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../../../libs/db-schema/src/generated/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // Set up the connection pool using the pg driver
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    // Prevent unhandled error crashes if Postgres drops an idle connection
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });

    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
