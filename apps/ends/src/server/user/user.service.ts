import { Injectable } from '@nestjs/common';
import { PrismaCommonService } from 'src/services/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaCommonService) { }

  async getAllUsers() {
    return this.prisma.user.findMany()
  }
}
