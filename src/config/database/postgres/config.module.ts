import { Module } from '@nestjs/common';
import { PostgresConfigService } from 'config/database/postgres/config.service';

@Module({
  providers: [PostgresConfigService],
})
export class PostgresConfigModule {}