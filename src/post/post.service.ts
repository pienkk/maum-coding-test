import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateUpdatePostDto,
  FetchPostDto,
  ResponsePostsDto,
} from './dto/post.dto';
import { PostEntity } from './entity/post.entity';
import { PostRepository } from './entity/post.repository';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async validationPost(userId: number, postId: number): Promise<PostEntity> {
    const post = await this.postRepository.findOneBy({ id: postId });

    if (!post) throw new HttpException('Post not found', HttpStatus.NOT_FOUND);

    if (post.userId !== userId)
      throw new HttpException(
        'Post is not your wrote',
        HttpStatus.UNAUTHORIZED,
      );

    return post;
  }

  async getPostsAll(fetchDto: FetchPostDto): Promise<ResponsePostsDto> {
    const [posts, count] = await this.postRepository.getPostsAll(fetchDto);
    const responsePostDto: ResponsePostsDto = { posts, count };

    return responsePostDto;
  }

  async getPostOne(id: number): Promise<PostEntity> {
    const post = await this.postRepository.getPostOne(id);

    if (!post) throw new HttpException('Post not found', HttpStatus.NOT_FOUND);

    return post;
  }

  async getMyPosts(
    fetchDto: FetchPostDto,
    userId: number,
  ): Promise<ResponsePostsDto> {
    const [posts, count] = await this.postRepository.getMyPosts(
      fetchDto,
      userId,
    );
    const responsePostDto: ResponsePostsDto = { posts, count };

    return responsePostDto;
  }

  async createPost(
    userId: number,
    args: CreateUpdatePostDto,
  ): Promise<PostEntity> {
    const post = this.postRepository.create({ ...args, userId });
    return await this.postRepository.save(post);
  }

  async updatePost(
    userId: number,
    args: CreateUpdatePostDto,
  ): Promise<PostEntity> {
    const post = await this.validationPost(userId, args.id);

    const entity = this.postRepository.create({ ...post, ...args });
    return await this.postRepository.save(entity);
  }

  async removePost(userId: number, postId: number): Promise<boolean> {
    const post = await this.validationPost(userId, postId);

    post.deleted_at = new Date();
    const result = await this.postRepository.save(post);

    return result.deleted_at ? true : false;
  }
}
