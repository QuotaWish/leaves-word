import { Injectable, OnModuleInit } from '@nestjs/common';
// import { PrismaClient } from '@prisma/client';
import { PrismaClient as CommonPrismaClient } from '../../prisma-common-database/common-database-client-types';
import { PrismaClient as MetaPrismaClient } from '../../prisma-meta-database/meta-database-client-types';

@Injectable()
export class PrismaCommonService extends CommonPrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

@Injectable()
export class PrismaMetaService extends MetaPrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
