import { Module } from '@nestjs/common';
import { TypeOrmConfigService } from './typeorm.service';

@Module({
  providers: [TypeOrmConfigService],
})
export class TypeOrmConfigModule {}
