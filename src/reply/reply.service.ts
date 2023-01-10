import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PostRepository } from 'src/post/entity/post.repository';
import {
  CreateUpdateReplyDto,
  FetchReplyDto,
  ResponseReplyDto,
} from './dto/reply.dto';
import { ReplyEntity } from './entity/reply.entity';
import { ReplyRepository } from './entity/reply.repository';

@Injectable()
export class ReplyService {
  constructor(
    private readonly replyRepository: ReplyRepository,
    private readonly postRepository: PostRepository,
  ) {}

  async getReplies({ id, page }: FetchReplyDto): Promise<ResponseReplyDto> {
    const post = await this.postRepository.findOneBy({ id });

    if (!post) throw new HttpException('Post not found', HttpStatus.NOT_FOUND);

    const [replies, count] = await this.replyRepository.getReplies(id, page);
    const responseReplyDto: ResponseReplyDto = { replies, count };

    return responseReplyDto;
  }

  async createReply(
    userId: number,
    args: CreateUpdateReplyDto,
  ): Promise<ReplyEntity> {
    const post = await this.postRepository.findOneBy({ id: args.postId });

    if (!post) throw new HttpException('Post not found', HttpStatus.NOT_FOUND);

    if (args.replyId) {
      const reply = await this.replyRepository.findOneBy({ id: args.replyId });

      if (!reply)
        throw new HttpException('Reply not found', HttpStatus.NOT_FOUND);

      if (reply.replyId)
        throw new HttpException(
          'Cannot reply on this reply',
          HttpStatus.BAD_REQUEST,
        );
    }

    const replyEntity = this.replyRepository.create({ ...args, userId });
    return await this.replyRepository.save(replyEntity);
  }
}
