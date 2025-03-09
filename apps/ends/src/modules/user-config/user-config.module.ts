import { Module } from '@nestjs/common';
import { UserConfigService } from './user-config.service';
import { UserConfigController } from './user-config.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserConfigEntity } from './entities/user-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserConfigEntity])],
  controllers: [UserConfigController],
  providers: [UserConfigService],
})
export class UserConfigModule { }
