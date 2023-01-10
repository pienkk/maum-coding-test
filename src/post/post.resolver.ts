import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtPayload } from 'jsonwebtoken';
import { JwtAuthGuard } from 'src/auth/security/auth.guard';
import { CurrentUser } from 'src/auth/security/auth.user.param';
import {
  CreateUpdatePostDto,
  FetchPostDto,
  ResponsePostsDto,
} from './dto/post.dto';
import { PostEntity } from './entity/post.entity';
import { PostService } from './post.service';

@Resolver()
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Query('fetchPosts')
  fetchPosts(
    @Args('fetchPostInput') fetchInput: FetchPostDto,
  ): Promise<ResponsePostsDto> {
    return this.postService.getPostsAll(fetchInput);
  }

  @Query('fetchPost')
  fetchPost(@Args('id') id: number) {
    return this.postService.getPostOne(id);
  }

  @Query('fetchMyPosts')
  @UseGuards(JwtAuthGuard)
  fetchMyPosts(
    @CurrentUser() currentUser: JwtPayload,
    @Args('fetchPostInput') fetchInput: FetchPostDto,
  ): Promise<ResponsePostsDto> {
    return this.postService.getMyPosts(fetchInput, currentUser.id);
  }

  @Mutation('createPost')
  @UseGuards(JwtAuthGuard)
  createPost(
    @CurrentUser() currentUser: JwtPayload,
    @Args('createPostInput') args: CreateUpdatePostDto,
  ): Promise<PostEntity> {
    return this.postService.createPost(currentUser.id, args);
  }

  @Mutation('updatePost')
  @UseGuards(JwtAuthGuard)
  updatePost(
    @CurrentUser() currentUser: JwtPayload,
    @Args('updatePostInput') args: CreateUpdatePostDto,
  ): Promise<PostEntity> {
    return this.postService.updatePost(currentUser.id, args);
  }

  @Mutation('removePost')
  @UseGuards(JwtAuthGuard)
  removePost(
    @CurrentUser() currentUser: JwtPayload,
    @Args('id') id: number,
  ): Promise<boolean> {
    return this.postService.removePost(currentUser.id, id);
  }
}
