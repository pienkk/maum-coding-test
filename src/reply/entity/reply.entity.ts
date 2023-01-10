import { PostEntity } from 'src/post/entity/post.entity';
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

@Entity('replies')
export class ReplyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  postId: number;

  @Column()
  comment: string;

  @Column({ nullable: true })
  replyId: number;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  deleted_at: Date;

  @ManyToOne(() => UserEntity, (user) => user.replies)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => PostEntity, (post) => post.replies)
  @JoinColumn({ name: 'postId' })
  post: PostEntity;

  @OneToMany(() => ReplyEntity, (reply) => reply.parent)
  childrenReply: ReplyEntity[];

  @ManyToOne(() => ReplyEntity, (reply) => reply.childrenReply)
  @JoinColumn({ name: 'replyId' })
  parent: ReplyEntity;
}
