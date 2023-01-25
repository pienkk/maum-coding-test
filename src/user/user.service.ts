import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUpdateUserDto, SignInUserDto } from './dto/user.dto';
import { UserRepository } from './entity/user.repository';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async validationUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user || user.deleted_at)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    if (!user.comparePassword(password))
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);

    return user;
  }

  async signIn(loginInfo: SignInUserDto): Promise<{ accessToken: string }> {
    const { email, password } = loginInfo;

    const user = await this.validationUser(email, password);

    const payload: JwtPayload = { id: user.id, email: user.email };
    return { accessToken: this.jwtService.sign(payload) };
  }

  async createUser(args: CreateUpdateUserDto): Promise<UserEntity> {
    const { email } = args;
    const user = await this.userRepository.findOneBy({ email });

    if (user && !user.deleted_at)
      throw new HttpException('User already exists', HttpStatus.CONFLICT);

    if (user && user.deleted_at) {
      user.deleted_at = null;
      return await this.userRepository.save(user);
    }

    const userEntity = this.userRepository.create(args);
    return await this.userRepository.save(userEntity);
  }

  async updateUser(args: CreateUpdateUserDto): Promise<UserEntity> {
    const { email } = args;
    const user = await this.userRepository.findOneBy({ email });

    if (!user || user.deleted_at)
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const updateUser = this.userRepository.create({ ...user, ...args });
    return await this.userRepository.save(updateUser);
  }

  async removeUser({ email }: JwtPayload, password: string): Promise<boolean> {
    const user = await this.validationUser(email, password);

    user.deleted_at = new Date();
    const result = await this.userRepository.save(user);

    return result.deleted_at ? true : false;
  }
}
