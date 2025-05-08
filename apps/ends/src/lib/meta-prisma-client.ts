import { PrismaClient } from '../../prisma-meta-database/meta-database-client-types';

const getPrisma = () => new PrismaClient();

const globalForMetaDBPrismaClient = global as unknown as {
  metaDBPrismaClient: ReturnType<typeof getPrisma>;
};

export const userDBPrismaClient =
  globalForMetaDBPrismaClient.metaDBPrismaClient || getPrisma();

if (process.env.NODE_ENV !== 'production')
  globalForMetaDBPrismaClient.metaDBPrismaClient = userDBPrismaClient;
