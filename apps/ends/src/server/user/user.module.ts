import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaCommonService } from 'src/services/prisma.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaCommonService]
})
export class UserModule { }
