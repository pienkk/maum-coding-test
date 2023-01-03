import { Expose } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

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

  @BeforeInsert()
  hashPassword() {
    this.password = bcrypt.hashSync(this.password, +process.env.HASH_SALT);
  }

  comparePassword(attempt: string): boolean {
    console.log(attempt, this.password);
    return bcrypt.compareSync(attempt, this.password);
  }
}
