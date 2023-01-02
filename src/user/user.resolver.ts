import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUpdateUserDto, SignInUserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation('signIn')
  async signIn(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const loginInfo: SignInUserDto = { email, password };
    return await this.userService.signIn(loginInfo);
  }

  @Mutation('createUser')
  createUser(@Args('createUserInput') args: CreateUpdateUserDto) {
    return this.userService.createUser(args);
  }

  @Mutation('updateUser')
  updateUser(@Args('updateUserInput') args: CreateUpdateUserDto) {
    return this.userService.updateUser(args);
  }

  @Mutation('removeUser')
  removeUser(@Args('id') id: number): Promise<boolean> {
    return this.userService.removeUser(id);
  }
}
