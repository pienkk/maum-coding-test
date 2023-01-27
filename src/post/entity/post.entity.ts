import { ReplyEntity } from 'src/reply/entity/reply.entity';
import { UserEntity } from 'src/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('posts')
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  userId: number;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  deleted_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.posts)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @OneToMany(() => ReplyEntity, (reply) => reply.post)
  replies: ReplyEntity[];

  static of(params: Partial<PostEntity>): PostEntity {
    const post = new PostEntity();
    Object.assign(post, params);

    return post;
  }
}
