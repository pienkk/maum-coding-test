import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PostEntity } from '../entity/post.entity';

export class CreateUpdatePostDto {
  @IsOptional()
  @IsString()
  id?: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
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
