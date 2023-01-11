import { CustomRepository } from 'config/typeorm/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { ReplyEntity } from './reply.entity';

@CustomRepository(ReplyEntity)
export class ReplyRepository extends Repository<ReplyEntity> {
  SHOW_COUNT = 10;

  async getReplies(postId: number, page: number) {
    return await this.createQueryBuilder('reply')
      .innerJoin('reply.post', 'post')
      .innerJoinAndSelect('reply.user', 'user')
      .leftJoinAndSelect('reply.childrenReply', 'childReply')
      .where('reply.postId = :postId', { postId })
      .andWhere('reply.deleted_at is null')
      .andWhere('reply.replyId is null')
      .andWhere('post.deleted_at is null')
      .andWhere('user.deleted_at is null')
      .take(this.SHOW_COUNT)
      .skip(this.SHOW_COUNT * (page - 1))
      .orderBy('reply.created_at', 'ASC')
      .getManyAndCount();
  }
}
