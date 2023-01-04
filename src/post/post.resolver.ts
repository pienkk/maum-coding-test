import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtPayload } from 'jsonwebtoken';
import { JwtAuthGuard } from 'src/auth/security/auth.guard';
import { CurrentUser } from 'src/auth/security/auth.user.param';
import { CreateUpdatePostDto, FetchPostDto } from './dto/post.dto';
import { PostService } from './post.service';

@Resolver()
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Query('fetchPosts')
  fetchPosts(@Args('page') page: number, @Args('search') search: string) {
    const fetchDto: FetchPostDto = { page, search };

    return this.postService.getPostsAll(fetchDto);
  }

  @Query('fetchPost')
  fetchPost(@Args('id') id: number) {
    return this.postService.getPostOne(id);
  }

  @Query('fetchMyPosts')
  @UseGuards(JwtAuthGuard)
  fetchMyPosts(
    @CurrentUser() currentUser: JwtPayload,
    @Args('page') page: number,
    @Args('search') search: string,
  ) {
    const fetchDto: FetchPostDto = { page, search };

    return this.postService.getMyPosts(fetchDto, currentUser);
  }

  @Mutation('createPost')
  @UseGuards(JwtAuthGuard)
  createPost(
    @CurrentUser() currentUser: JwtPayload,
    @Args('createPostInput') args: CreateUpdatePostDto,
  ) {
    return this.postService.createPost(currentUser, args);
  }

  @Mutation('updatePost')
  @UseGuards(JwtAuthGuard)
  updatePost(
    @CurrentUser() currentUser: JwtAuthGuard,
    @Args('updatePostInput') args: CreateUpdatePostDto,
  ) {
    return this.postService.updatePost(currentUser, args);
  }

  @Mutation('removePost')
  @UseGuards(JwtAuthGuard)
  removePost(@CurrentUser() currentUser: JwtAuthGuard, @Args('id') id: number) {
    return this.postService.removePost(currentUser, id);
  }
}
