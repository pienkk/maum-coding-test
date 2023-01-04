import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'config/typeorm/typeorm-ex.module';
import { UserRepository } from './entity/user.repository';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([UserRepository]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: config.get<string>('JWT_EXPIRESIN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UserResolver, UserService],
})
export class UserModule {}
