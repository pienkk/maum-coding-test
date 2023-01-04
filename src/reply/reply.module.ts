import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'config/typeorm/typeorm-ex.module';
import { PostRepository } from 'src/post/entity/post.repository';
import { ReplyRepository } from './entity/reply.repository';
import { ReplyResolver } from './reply.resolver';
import { ReplyService } from './reply.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([ReplyRepository, PostRepository]),
  ],
  providers: [ReplyResolver, ReplyService],
})
export class ReplyModule {}
