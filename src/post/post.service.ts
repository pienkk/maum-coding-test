import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtPayload } from 'jsonwebtoken';
import {
  CreateUpdatePostDto,
  FetchPostDto,
  ResponsePostsDto,
} from './dto/post.dto';
import { PostRepository } from './entity/post.repository';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async getPostsAll(fetchDto: FetchPostDto) {
    const [posts, count] = await this.postRepository.getPostsAll(fetchDto);
    const responsePostDto: ResponsePostsDto = { posts, count };

    return responsePostDto;
  }

  async getPostOne(id: number) {
    const post = await this.postRepository.getPostOne(id);

    if (!post) throw new HttpException('Post not found', HttpStatus.NOT_FOUND);

    return post;
  }

  async getMyPosts(fetchDto: FetchPostDto, { id }: JwtPayload) {
    const [posts, count] = await this.postRepository.getMyPosts(fetchDto, id);
    const responsePostDto: ResponsePostsDto = { posts, count };

    return responsePostDto;
  }

  createPost({ id }: JwtPayload, args: CreateUpdatePostDto) {
    const entity = CreateUpdatePostDto.toEntity(args, id);

    return this.postRepository.createPost(entity);
  }

  async updatePost({ id }: JwtPayload, args: CreateUpdatePostDto) {
    const post = await this.postRepository.getPostById(Number(args.id));

    if (!post) throw new HttpException('Post not found', HttpStatus.NOT_FOUND);

    if (post.userId !== id)
      throw new HttpException(
        'Post is not your wrote',
        HttpStatus.UNAUTHORIZED,
      );

    const entity = CreateUpdatePostDto.toEntity(args, id);

    return this.postRepository.updatePost(entity, post);
  }

  async removePost({ id }: JwtPayload, postId: number) {
    const post = await this.postRepository.getPostById(postId);

    if (!post) throw new HttpException('Post not found', HttpStatus.NOT_FOUND);

    if (post.userId !== id)
      throw new HttpException(
        'Post is not your wrote',
        HttpStatus.UNAUTHORIZED,
      );

    const result = await this.postRepository.removePost(post);

    return result.deleted_at ? true : false;
  }
}
