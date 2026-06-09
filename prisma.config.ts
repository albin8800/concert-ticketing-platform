import 'dotenv/config'; // Load environment variables from .env file
import { defineConfig } from 'prisma/config'; // Or 'prisma/config' depending on exact version
export default defineConfig({
  schema: 'libs/db-schema/prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    path: 'libs/db-schema/prisma/migrations',
  },
});