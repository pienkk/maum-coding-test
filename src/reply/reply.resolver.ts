import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtPayload } from 'jsonwebtoken';
import { JwtAuthGuard } from 'src/auth/security/auth.guard';
import { CurrentUser } from 'src/auth/security/auth.user.param';
import {
  CreateUpdateReplyDto,
  FetchReplyDto,
  ResponseReplyDto,
} from './dto/reply.dto';
import { ReplyEntity } from './entity/reply.entity';
import { ReplyService } from './reply.service';

@Resolver()
export class ReplyResolver {
  constructor(private readonly replyService: ReplyService) {}

  @Query('fetchReplies')
  fetchReplies(
    @Args('fetchReplyInput') fetchInput: FetchReplyDto,
  ): Promise<ResponseReplyDto> {
    return this.replyService.getReplies(fetchInput);
  }

  @Mutation('createReply')
  @UseGuards(JwtAuthGuard)
  createReply(
    @CurrentUser() currentUser: JwtPayload,
    @Args('createReplyInput') args: CreateUpdateReplyDto,
  ): Promise<ReplyEntity> {
    return this.replyService.createReply(currentUser.id, args);
  }
}
