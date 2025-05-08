import { PrismaClient } from '../../prisma-common-database/common-database-client-types';

const getPrisma = () => new PrismaClient();

const globalForCommonDBPrismaClient = global as unknown as {
  commonDBPrismaClient: ReturnType<typeof getPrisma>;
};

export const commonDBPrismaClient =
  globalForCommonDBPrismaClient.commonDBPrismaClient || getPrisma();

if (process.env.NODE_ENV !== 'production')
  globalForCommonDBPrismaClient.commonDBPrismaClient = commonDBPrismaClient;
