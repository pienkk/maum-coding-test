import { CustomRepository } from 'config/typeorm/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { FetchPostDto } from '../dto/post.dto';
import { PostEntity } from './post.entity';

@CustomRepository(PostEntity)
export class PostRepository extends Repository<PostEntity> {
  SHOW_COUNT = 10;

  async getPostById(id: number) {
    return await this.createQueryBuilder('post')
      .where('deleted_at is null')
      .andWhere('id = :id', { id })
      .getOne();
  }

  async getPostsAll({ page, search }: FetchPostDto) {
    return await this.createQueryBuilder('post')
      .innerJoinAndSelect('post.user', 'user')
      .where('user.deleted_at is null')
      .andWhere('post.deleted_at is null')
      .andWhere('post.title LIKE :search', { search: `%${search}%` })
      .take(this.SHOW_COUNT)
      .skip(this.SHOW_COUNT * (page - 1))
      .orderBy('post.created_at', 'ASC')
      .getManyAndCount();
  }

  async getPostOne(id: number) {
    return await this.createQueryBuilder('post')
      .innerJoinAndSelect('post.user', 'user')
      .where('user.deleted_at is null')
      .andWhere('post.deleted_at is null')
      .andWhere('post.id = :id', { id })
      .getOne();
  }

  async getMyPosts({ page, search }: FetchPostDto, userId: number) {
    return await this.createQueryBuilder('post')
      .where('post.userId = :userId', {
        userId,
      })
      .andWhere('post.deleted_at is null')
      .andWhere('post.title LIKE :search', { search: `%${search}%` })
      .take(this.SHOW_COUNT)
      .skip(this.SHOW_COUNT * (page - 1))
      .orderBy('post.created_at', 'ASC')
      .getManyAndCount();
  }
}
