import { CustomRepository } from 'config/typeorm/typeorm-ex.decorator';
import { CreateUserInput, UpdateUserInput } from 'src/graphql';
import { Repository } from 'typeorm';
import { CreateUpdateUserDto } from '../dto/user.dto';
import { UserEntity } from './user.entity';

@CustomRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async getUserById(id: number) {
    return await this.findOneBy({ id });
  }

  async getUserByEmail(email: string) {
    return await this.findOneBy({ email });
  }

  async createUser(input: CreateUserInput) {
    const user = this.create(input);
    await this.save(user);
    return user;
  }

  async reCreateUser(userInfo: UserEntity) {
    userInfo.deleted_at = null;
    return await this.save(userInfo);
  }

  async updateUser({ name, email, password }: UpdateUserInput) {
    return await this.createQueryBuilder('u')
      .update()
      .set({ name, password })
      .where('email = :email', { email })
      .execute();
  }

  async removeUser(user: UserEntity) {
    user.deleted_at = new Date();
    return await this.save(user);
  }
}
