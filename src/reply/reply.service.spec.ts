import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { compile } from 'joi';
import { async } from 'rxjs';
import { PostEntity } from 'src/post/entity/post.entity';
import { PostRepository } from 'src/post/entity/post.repository';
import { CreateUpdateReplyDto, FetchReplyDto } from './dto/reply.dto';
import { ReplyEntity } from './entity/reply.entity';
import { ReplyRepository } from './entity/reply.repository';
import { ReplyService } from './reply.service';

describe('ReplyService', () => {
  let replyService: ReplyService;
  let replyRepository: ReplyRepository;
  let postRepository: PostRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReplyService, ReplyRepository, PostRepository],
    }).compile();

    replyService = module.get<ReplyService>(ReplyService);
    replyRepository = module.get<ReplyRepository>(ReplyRepository);
    postRepository = module.get<PostRepository>(PostRepository);
  });

  describe('getReplies', () => {
    const fetchReplyDto: FetchReplyDto = {
      id: 1,
    };
    const existingPost = PostEntity.of({ id: 1 });
    const existingReplies = [
      ReplyEntity.of({ id: 1, postId: 1, comment: '첫번째 댓글' }),
      ReplyEntity.of({ id: 2, postId: 1, comment: '두번째 댓글' }),
    ];
    const existingCount = 2;
    const existingRepliesAndCount = {
      replies: existingReplies,
      count: existingCount,
    };

    it('요청한 게시글에 대한 댓글 리스트를 반환한다.', async () => {
      const postRepositoryFindOneSpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(existingPost);
      const replyRepositoryGetRepliesSpy = jest
        .spyOn(replyRepository, 'getReplies')
        .mockResolvedValue([existingReplies, existingCount]);

      const result = await replyService.getReplies(fetchReplyDto);

      expect(postRepositoryFindOneSpy).toHaveBeenCalledWith({
        id: fetchReplyDto.id,
      });
      expect(replyRepositoryGetRepliesSpy).toHaveBeenCalledWith(
        fetchReplyDto.id,
        fetchReplyDto.page,
      );
      expect(result).toEqual(existingRepliesAndCount);
    });

    it('요청한 게시글이 존재하지 않을 시 게시글이 존재하지 않다는 예외를 던진다.', async () => {
      const postRepositoryFindOneSpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(undefined);

      const result = async () => {
        await replyService.getReplies(fetchReplyDto);
      };

      expect(result).rejects.toThrow(
        new HttpException('Post not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('createReply', () => {
    const userId = 1;
    const existingPost = PostEntity.of({ id: 1 });
    const existingReply = ReplyEntity.of({
      id: 1,
      userId: 1,
      postId: 1,
      comment: '첫번째 댓글',
    });
    const existingReReply = ReplyEntity.of({ ...existingReply, replyId: 1 });
    const createReplyDto: CreateUpdateReplyDto = {
      postId: 1,
      comment: '두번째 댓글',
    };
    const createReReplyDto: CreateUpdateReplyDto = {
      ...createReplyDto,
      replyId: 1,
    };
    const createdReply = ReplyEntity.of({ ...createReplyDto, userId });
    const savedReply = ReplyEntity.of({
      ...createdReply,
      replyId: null,
      created_at: new Date(),
      deleted_at: null,
    });
    const createdReReply = ReplyEntity.of({ ...createReReplyDto, userId });
    const savedReReply = ReplyEntity.of({
      ...createdReReply,
      created_at: new Date(),
      deleted_at: null,
    });

    it('댓글 생성 후 댓글 정보를 반환한다.', async () => {
      const postRepositoryFindOneSpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(existingPost);
      const replyRepositoryCreateSpy = jest
        .spyOn(replyRepository, 'create')
        .mockReturnValue(createdReply);
      const replyRepositorySaveSpy = jest
        .spyOn(replyRepository, 'save')
        .mockResolvedValue(savedReply);

      const result = await replyService.createReply(userId, createReplyDto);

      expect(postRepositoryFindOneSpy).toHaveBeenCalledWith({
        id: createReplyDto.postId,
      });
      expect(replyRepositoryCreateSpy).toHaveBeenCalledWith({
        ...createReplyDto,
        userId,
      });
      expect(replyRepositorySaveSpy).toHaveBeenCalledWith(createdReply);
      expect(result).toEqual(savedReply);
    });

    it('대댓글 작성 후 댓글 정보를 반환한다.', async () => {
      const postRepositoryFindOneSpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(existingPost);
      const replyRepositoryFindOneSpy = jest
        .spyOn(replyRepository, 'findOneBy')
        .mockResolvedValue(existingReply);
      const replyRepositoryCreateSpy = jest
        .spyOn(replyRepository, 'create')
        .mockReturnValue(createdReReply);
      const replyRepositorySaveSpy = jest
        .spyOn(replyRepository, 'save')
        .mockResolvedValue(savedReReply);

      const result = await replyService.createReply(userId, createReReplyDto);

      expect(postRepositoryFindOneSpy).toHaveBeenCalledWith({
        id: createReReplyDto.postId,
      });
      expect(replyRepositoryFindOneSpy).toHaveBeenCalledWith({
        id: createReReplyDto.replyId,
      });
      expect(replyRepositoryCreateSpy).toHaveBeenCalledWith({
        ...createReReplyDto,
        userId,
      });
      expect(replyRepositorySaveSpy).toHaveBeenCalledWith(createdReReply);
      expect(result).toEqual(savedReReply);
    });

    it('댓글 작성 요청 시 해당 게시글이 존재하지 않을 경우 게시글이 존재하지 않는다는 예외를 던진다.', async () => {
      const postRepositoryFindOneSpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(undefined);

      const result = async () => {
        await replyService.createReply(userId, createReplyDto);
      };

      expect(result).rejects.toThrow(
        new HttpException('Post not found', HttpStatus.NOT_FOUND),
      );
    });

    it('대댓글 작성 요청 시 해당 댓글이 존재하지 않을 경우 댓글이 존재하지 않는다는 예외를 던진다.', async () => {
      const postRepositoryFindOneSpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(existingPost);
      const replyRepositoryFindOneSpy = jest
        .spyOn(replyRepository, 'findOneBy')
        .mockResolvedValue(undefined);

      const result = async () => {
        await replyService.createReply(userId, createReReplyDto);
      };

      expect(result).rejects.toThrow(
        new HttpException('Reply not found', HttpStatus.NOT_FOUND),
      );
    });

    it('대댓글에 댓글 작성 요청 시 해당 댓글에는 댓글을 작성하지 못한다는 예외를 던진다.', async () => {
      const postRepositoryFindOneSpy = jest
        .spyOn(postRepository, 'findOneBy')
        .mockResolvedValue(existingPost);
      const replyRepositoryFindOneSpy = jest
        .spyOn(replyRepository, 'findOneBy')
        .mockResolvedValue(existingReReply);

      const result = async () => {
        await replyService.createReply(userId, createReReplyDto);
      };

      expect(result).rejects.toThrow(
        new HttpException('Cannot reply on this reply', HttpStatus.BAD_REQUEST),
      );
    });
  });
});
