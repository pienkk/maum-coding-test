import { CustomRepository } from 'config/typeorm/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { ReplyEntity } from './reply.entity';

@CustomRepository(ReplyEntity)
export class ReplyRepository extends Repository<ReplyEntity> {
  SHOW_COUNT = 10;

  async getReplyById(id: number) {
    return await this.findOneBy({ id });
  }

  async getReplies(postId: number, page: number) {
    return await this.createQueryBuilder('r')
      .innerJoin('r.post', 'p')
      .innerJoinAndSelect('r.user', 'u')
      .leftJoinAndSelect('r.parents', 'rr')
      .where('r.postId = :postId', { postId })
      .andWhere('r.deleted_at is null')
      .andWhere('r.replyId is null')
      .andWhere('p.deleted_at is null')
      .andWhere('u.deleted_at is null')
      .take(this.SHOW_COUNT)
      .skip(this.SHOW_COUNT * (page - 1))
      .orderBy('r.created_at', 'ASC')
      .getManyAndCount();
  }

  async createReply(entity: ReplyEntity) {
    return await this.save(entity);
  }
}
