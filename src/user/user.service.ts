import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUpdateUserDto, SignInUserDto } from './dto/user.dto';
import { UserRepository } from './entity/user.repository';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(loginInfo: SignInUserDto) {
    const { email, password } = loginInfo;
    const user = await this.userRepository.getUserByEmail(email);

    if (!user || user.deleted_at)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (!user.comparePassword(password))
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);

    const payload: JwtPayload = { id: user.id, email: user.email };
    return { accessToken: this.jwtService.sign(payload) };
  }

  async createUser(args: CreateUpdateUserDto) {
    const { email } = args;
    const user = await this.userRepository.getUserByEmail(email);

    if (user && !user.deleted_at)
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);

    if (user && user.deleted_at) return this.userRepository.reCreateUser(user);

    return this.userRepository.createUser(args);
  }

  async updateUser(args: CreateUpdateUserDto) {
    const { email } = args;
    const user = await this.userRepository.getUserByEmail(email);

    if (!user || user.deleted_at)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    return this.userRepository.updateUser(args, user);
  }

  async removeUser({ id }: JwtPayload, password: string) {
    const user = await this.userRepository.getUserById(id);

    if (!user || user.deleted_at)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (!user.comparePassword(password))
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);

    const result = await this.userRepository.removeUser(user);

    return result.deleted_at ? true : false;
  }
}
