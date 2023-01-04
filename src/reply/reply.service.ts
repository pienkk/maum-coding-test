import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtPayload } from 'jsonwebtoken';
import { PostRepository } from 'src/post/entity/post.repository';
import { CreateUpdateReplyDto, ResponseReplyDto } from './dto/reply.dto';
import { ReplyRepository } from './entity/reply.repository';

@Injectable()
export class ReplyService {
  constructor(
    private readonly replyRepository: ReplyRepository,
    private readonly postRepository: PostRepository,
  ) {}

  async getReplies(postId: number, page: number) {
    const post = await this.postRepository.getPostById(postId);

    if (!post) throw new HttpException('Post not found', HttpStatus.NOT_FOUND);

    const [replies, count] = await this.replyRepository.getReplies(
      postId,
      page,
    );
    const responseReplyDto: ResponseReplyDto = { replies, count };

    return responseReplyDto;
  }

  async createReply({ id }: JwtPayload, args: CreateUpdateReplyDto) {
    const post = await this.postRepository.getPostById(args.postId);

    if (!post) throw new HttpException('Post not found', HttpStatus.NOT_FOUND);

    const entity = CreateUpdateReplyDto.toEntity(args, id);

    return this.replyRepository.createReply(entity);
  }
}
