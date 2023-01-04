import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtPayload } from 'jsonwebtoken';
import { JwtAuthGuard } from 'src/auth/security/auth.guard';
import { CurrentUser } from 'src/auth/security/auth.user.param';
import { CreateUpdateReplyDto } from './dto/reply.dto';
import { ReplyService } from './reply.service';

@Resolver()
export class ReplyResolver {
  constructor(private readonly replyService: ReplyService) {}

  @Query('fetchReplies')
  fetchReplies(@Args('postId') postId: number, @Args('page') page: number) {
    return this.replyService.getReplies(postId, page);
  }

  @Mutation('createReply')
  @UseGuards(JwtAuthGuard)
  createReply(
    @CurrentUser() currentUser: JwtPayload,
    @Args('createReplyInput') args: CreateUpdateReplyDto,
  ) {
    return this.replyService.createReply(currentUser, args);
  }
}
