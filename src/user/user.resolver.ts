import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { JwtPayload } from 'src/auth/jwt-payload.interface';
import { JwtAuthGuard } from 'src/auth/security/auth.guard';
import { CurrentUser } from 'src/auth/security/auth.user.param';
import { CreateUpdateUserDto, SignInUserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation('signIn')
  signIn(@Args('email') email: string, @Args('password') password: string) {
    const loginInfo: SignInUserDto = { email, password };
    return this.userService.signIn(loginInfo);
  }

  @Mutation('createUser')
  createUser(@Args('createUserInput') args: CreateUpdateUserDto) {
    return this.userService.createUser(args);
  }

  @Mutation('updateUser')
  @UseGuards(JwtAuthGuard)
  updateUser(@Args('updateUserInput') args: CreateUpdateUserDto) {
    return this.userService.updateUser(args);
  }

  @Mutation('removeUser')
  @UseGuards(JwtAuthGuard)
  removeUser(
    @CurrentUser() CurrentUser: JwtPayload,
    @Args('password') password: string,
  ): Promise<boolean> {
    return this.userService.removeUser(CurrentUser, password);
  }
}
