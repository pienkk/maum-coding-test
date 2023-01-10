import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ReplyEntity } from '../entity/reply.entity';

export class CreateUpdateReplyDto {
  @IsOptional()
  @IsOptional()
  id?: number;

  @IsNotEmpty()
  @IsNumber()
  postId: number;

  @IsNotEmpty()
  @IsString()
  comment: string;

  @IsOptional()
  @IsNumber()
  replyId?: number;
}

export class ResponseReplyDto {
  replies: ReplyEntity[];

  @IsNumber()
  count: number;
}

export class FetchReplyDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsNumber()
  page?: number = 1;
}
