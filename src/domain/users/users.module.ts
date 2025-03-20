import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'domain/users/entities/user.entity';
import { UsersService } from 'domain/users/users.service';
import { UsersController } from 'domain/users/users.controller';
import { Profile } from 'domain/users/entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
