import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { JwtAuthGuard } from 'src/auth/security/auth.guard';
import { CurrentUser } from 'src/auth/security/auth.user.param';
import { CreateUpdateUserDto, SignInUserDto } from './dto/user.dto';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation('signIn')
  signIn(
    @Args('signIn') args: SignInUserDto,
  ): Promise<{ accessToken: string }> {
    return this.userService.signIn(args);
  }

  @Mutation('createUser')
  createUser(
    @Args('createUserInput') args: CreateUpdateUserDto,
  ): Promise<UserEntity> {
    return this.userService.createUser(args);
  }

  @Mutation('updateUser')
  @UseGuards(JwtAuthGuard)
  updateUser(
    @Args('updateUserInput') args: CreateUpdateUserDto,
  ): Promise<UserEntity> {
    return this.userService.updateUser(args);
  }

  @Mutation('removeUser')
  @UseGuards(JwtAuthGuard)
  removeUser(
    @CurrentUser() currentUser: JwtPayload,
    @Args('password') password: string,
  ): Promise<boolean> {
    return this.userService.removeUser(currentUser, password);
  }
}
