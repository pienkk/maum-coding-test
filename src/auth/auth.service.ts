import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/user/entity/user.entity';
import { UserRepository } from 'src/user/entity/user.repository';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}
  async tokenValidateUser(
    payload: JwtPayload,
  ): Promise<UserEntity | undefined> {
    return await this.userRepository.getUserById(payload.id);
  }
}
