import { CustomRepository } from 'config/typeorm/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { FetchPostDto } from '../dto/post.dto';
import { PostEntity } from './post.entity';

@CustomRepository(PostEntity)
export class PostRepository extends Repository<PostEntity> {
  async getPostById(id: number) {
    return await this.createQueryBuilder('p')
      .where('deleted_at is null')
      .andWhere('id = :id', { id })
      .getOne();
  }

  async getPostsAll({ page, search }: FetchPostDto) {
    return await this.createQueryBuilder('p')
      .innerJoinAndSelect('p.user', 'u')
      .where('u.deleted_at is null')
      .andWhere('p.deleted_at is null')
      .andWhere('p.title LIKE :search', { search: `%${search}%` })
      .take(10)
      .skip(page - 1)
      .getManyAndCount();
  }

  async getPostOne(id: number) {
    return await this.createQueryBuilder('p')
      .innerJoinAndSelect('p.user', 'u')
      .where('u.deleted_at is null')
      .andWhere('p.deleted_at is null')
      .andWhere('p.id = :id', { id })
      .getOne();
  }

  async getMyPosts({ page, search }: FetchPostDto, userId: number) {
    return await this.createQueryBuilder('p')
      .where('p.userId = :userId', {
        userId,
      })
      .andWhere('p.deleted_at is null')
      .andWhere('p.title LIKE :search', { search: `%${search}%` })
      .take(10)
      .skip(page - 1)
      .getManyAndCount();
  }

  async createPost(args: PostEntity) {
    const post = this.create(args);

    return await this.save(post);
  }

  async updatePost(args: PostEntity, post: PostEntity) {
    return await this.save(this.create({ ...post, ...args }));
  }

  async removePost(post: PostEntity) {
    post.deleted_at = new Date();

    return await this.save(post);
  }
}
