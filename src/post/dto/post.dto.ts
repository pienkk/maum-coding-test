import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PostEntity } from '../entity/post.entity';

export class CreateUpdatePostDto {
  @IsOptional()
  id?: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  static toEntity(args: CreateUpdatePostDto, id: number): PostEntity {
    const entity = new PostEntity();
    if (args.id) entity.id = Number(args.id);
    entity.title = args.title;
    entity.description = args.description;
    entity.userId = id;
    return entity;
  }
}

export class FetchPostDto {
  @IsNumber()
  @IsOptional()
  page?: number = 1;

  @IsString()
  @IsOptional()
  search?: string = '';
}

export class ResponsePostsDto {
  posts: PostEntity[];

  count: number;
}
