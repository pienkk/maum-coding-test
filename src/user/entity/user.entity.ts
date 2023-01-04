import { Expose } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PostEntity } from 'src/post/entity/post.entity';
import { ReplyEntity } from 'src/reply/entity/reply.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Expose()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true })
  @Expose()
  deleted_at: Date;

  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];

  @OneToMany(() => ReplyEntity, (reply) => reply.user)
  replies: ReplyEntity[];

  @BeforeInsert()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, +process.env.HASH_SALT);
  }

  comparePassword(attempt: string): boolean {
    return bcrypt.compareSync(attempt, this.password);
  }
}
