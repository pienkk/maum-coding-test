import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CreateUpdatePostDto,
  FetchPostDto,
  ResponsePostsDto,
} from './dto/post.dto';
import { PostEntity } from './entity/post.entity';
import { PostRepository } from './entity/post.repository';
import { PostService } from './post.service';

describe('PostService', () => {
  let postService: PostService;
  let postRepository: PostRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostService, PostRepository],
    }).compile();

    postService = module.get<PostService>(PostService);
    postRepository = module.get<PostRepository>(PostRepository);
  });

  describe('getPostsAll', () => {
    const fetchDto: FetchPostDto = {
      page: 1,
    };
    const existingPosts = [
      PostEntity.of({
        id: 1,
        title: '첫 게시글',
        description: '첫 내용',
        userId: 1,
        created_at: null,
        deleted_at: null,
        user: null,
        replies: null,
      }),
      PostEntity.of({
        id: 2,
        title: '두번째 게시글',
        description: '두번째 내용',
        userId: 1,
        created_at: null,
        deleted_at: null,
        user: null,
        replies: null,
      }),
    ];
    const existingCount = 2;
    const existingPostsAndCount: ResponsePostsDto = {
      posts: existingPosts,
      count: existingCount,
    };

    it('게시글 목록을 반환한다.', async () => {
      const postRepositorygetPostAllSpy = jest
        .spyOn(postRepository, 'getPostsAll')
        .mockResolvedValue([existingPosts, existingCount]);

      const result = await postService.getPostsAll(fetchDto);

      expect(postRepositorygetPostAllSpy).toHaveBeenCalledWith(fetchDto);
      expect(result).toEqual(existingPostsAndCount);
    });
  });

  describe('getPostOne', () => {
    const postId = 1;
    const existingPost = PostEntity.of({
      id: 1,
      title: '첫 게시글',
      description: '첫 내용',
      userId: 1,
      created_at: null,
      deleted_at: null,
      user: null,
      replies: null,
    });

    it('게시글이 존재할 시 게시글 정보를 반환한다.', async () => {
      const postRepositorygetPostOneSpy = jest
        .spyOn(postRepository, 'getPostOne')
        .mockResolvedValue(existingPost);

      const result = await postService.getPostOne(postId);

      expect(postRepositorygetPostOneSpy).toHaveBeenCalledWith(postId);
      expect(result).toEqual(existingPost);
    });

    it('게시글이 존재하지 않을 시 게시글이 존재하지 않는다는 예외를 던진다.', async () => {
      const postRepositorygetPostOneSpy = jest
        .spyOn(postRepository, 'getPostOne')
        .mockResolvedValue(undefined);

      const result = async () => {
        await postService.getPostOne(postId);
      };

      expect(result).rejects.toThrow(
        new HttpException('Post not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('getMyPosts', () => {
    const userId = 1;
    const fetchDto: FetchPostDto = {
      page: 1,
    };
    const existingPosts = [
      PostEntity.of({
        id: 1,
        title: '첫 게시글',
        description: '첫 내용',
        userId: 1,
        created_at: null,
        deleted_at: null,
        user: null,
        replies: null,
      }),
      PostEntity.of({
        id: 2,
        title: '두번째 게시글',
        description: '두번째 내용',
        userId: 1,
        created_at: null,
        deleted_at: null,
        user: null,
        replies: null,
      }),
    ];
    const existingCount = 2;
    const existingPostsAndCount: ResponsePostsDto = {
      posts: existingPosts,
      count: existingCount,
    };

    it('접속한 유저의 게시글 목록을 반환한다.', async () => {
      const postRepositoryGetMyPostsSpy = jest
        .spyOn(postRepository, 'getMyPosts')
        .mockResolvedValue([existingPosts, existingCount]);

      const result = await postService.getMyPosts(fetchDto, userId);

      expect(postRepositoryGetMyPostsSpy).toHaveBeenCalledWith(
        fetchDto,
        userId,
      );
      expect(result).toEqual(existingPostsAndCount);
    });
  });

  describe('createPost', () => {
    const userId = 1;
    const createPostDto: CreateUpdatePostDto = {
      title: '첫 게시글',
      description: '첫 내용',
    };
    const createPost = PostEntity.of({
      title: '첫 게시글',
      description: '첫 내용',
      userId: 1,
      deleted_at: null,
      user: null,
      replies: null,
    });
    const savedPost = PostEntity.of({
      ...createPost,
      id: 1,
      created_at: new Date('2023-01-27'),
      deleted_at: null,
      user: null,
      replies: null,
    });

    it('게시글 생성 성공 시 생성된 게시글 정보 반환한다.', async () => {
      const postRepositoryCreateSpy = jest
        .spyOn(postRepository, 'create')
        .mockReturnValueOnce(createPost);
      const postRepositorySaveSpy = jest
        .spyOn(postRepository, 'save')
        .mockResolvedValue(savedPost);

      const result = await postService.createPost(userId, createPostDto);

      expect(postRepositoryCreateSpy).toHaveBeenCalledWith({
        ...createPostDto,
        userId,
      });
      expect(postRepositorySaveSpy).toHaveBeenCalledWith(createPost);
      expect(result).toEqual(savedPost);
    });
  });

  describe('updatePost', () => {
    const userId = 1;
    const updatePostDto: CreateUpdatePostDto = {
      id: 1,
      title: '첫 게시글 수정',
      description: '수정 했습니다.',
    };
    const existingPost = PostEntity.of({
      id: 1,
      title: '첫 게시글',
      description: '첫 내용',
      userId: 1,
      created_at: new Date('2023-01-27'),
      deleted_at: null,
      user: null,
      replies: null,
    });
    const savedPost = PostEntity.of({
      ...existingPost,
      ...updatePostDto,
    });

    it('게시글 수정에 성공 시 게시글 정보를 반환한다.', async () => {
      const postRepositoryFindOneSpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(existingPost);
      const postRepositoryCreateSpy = jest
        .spyOn(postRepository, 'create')
        .mockReturnValueOnce(savedPost);
      const postRepositorySaveSpy = jest
        .spyOn(postRepository, 'save')
        .mockResolvedValue(savedPost);

      const result = await postService.updatePost(userId, updatePostDto);

      expect(postRepositoryFindOneSpy).toHaveBeenCalledWith({
        id: updatePostDto.id,
      });
      expect(postRepositoryCreateSpy).toHaveBeenCalledWith({
        ...existingPost,
        ...updatePostDto,
      });
      expect(postRepositorySaveSpy).toHaveBeenCalledWith(savedPost);
      expect(result).toEqual(savedPost);
    });

    it('존재하지 않는 게시글 수정 요청 시 게시글이 존재하지 않는다는 예외를 던진다.', async () => {
      const postRepositoryFindOneSpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(undefined);

      const result = async () => {
        await postService.updatePost(userId, updatePostDto);
      };

      expect(result).rejects.toThrowError(
        new HttpException('Post not found', HttpStatus.NOT_FOUND),
      );
    });

    it('게시글을 작성하지 않은 유저가 게시글 수정 요청 시 수정 권한이 없다는 예외를 던진다.', async () => {
      const anotherUserId = 2;
      const postRepositoryFindOneSpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(existingPost);

      const result = async () => {
        await postService.updatePost(anotherUserId, updatePostDto);
      };

      expect(result).rejects.toThrowError(
        new HttpException('Post is not your wrote', HttpStatus.UNAUTHORIZED),
      );
    });
  });
  describe('removePost', () => {
    const time = new Date('2023-01-27');
    jest.useFakeTimers();
    jest.setSystemTime(time);
    const userId = 1;
    const postId = 1;
    const existingPost = PostEntity.of({
      id: 1,
      title: '첫 게시글',
      description: '첫 내용',
      userId: 1,
      created_at: new Date('2023-01-27'),
      deleted_at: null,
      user: null,
      replies: null,
    });
    const removedPost = PostEntity.of({
      ...existingPost,
      deleted_at: new Date(),
    });

    it('게시글 삭제 성공 시 true 값을 반환한다.', async () => {
      const postRepositoryFindOneSpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(existingPost);
      const postRepositorySaveSpy = jest
        .spyOn(postRepository, 'save')
        .mockResolvedValue(removedPost);

      const result = await postService.removePost(userId, postId);

      expect(postRepositoryFindOneSpy).toHaveBeenCalledWith({ id: postId });
      expect(postRepositorySaveSpy).toHaveBeenCalledWith(removedPost);
      expect(result).toBe(true);
    });
  });
});
