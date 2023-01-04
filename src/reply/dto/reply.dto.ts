import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ReplyEntity } from '../entity/reply.entity';

export class CreateUpdateReplyDto {
  @IsOptional()
  id?: string;

  @IsNotEmpty()
  @IsNumber()
  postId: number;

  @IsNotEmpty()
  @IsString()
  comment: string;

  @IsOptional()
  @IsNumber()
  replyId?: number;

  static toEntity(args: CreateUpdateReplyDto, userId: number): ReplyEntity {
    const entity = new ReplyEntity();
    if (args.id) entity.id = Number(args.id);
    if (args.replyId) entity.replyId = args.replyId;

    entity.postId = args.postId;
    entity.userId = userId;
    entity.comment = args.comment;

    return entity;
  }
}

export class ResponseReplyDto {
  replies: ReplyEntity[];

  @IsNumber()
  count: number;
}
