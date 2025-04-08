import { Injectable, type OnApplicationBootstrap, type OnApplicationShutdown } from '@nestjs/common';

import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnApplicationBootstrap, OnApplicationShutdown {

  async onApplicationBootstrap() {
    await this.$connect();
  }

  async onApplicationShutdown() {
    await this.$disconnect();
  }
}
