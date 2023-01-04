import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'config/typeorm/typeorm-ex.module';
import { PostRepository } from './entity/post.repository';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([PostRepository])],
  providers: [PostResolver, PostService],
})
export class PostModule {}
