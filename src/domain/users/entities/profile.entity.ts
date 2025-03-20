import { IsNotEmpty } from 'class-validator';
import {
  BaseEntity,
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';

@Entity({
  name: 'USER_PROFILE',
})
export class Profile extends BaseEntity {
  @PrimaryColumn()
  @OneToOne(() => User, (user) => user.id, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  userId: number;

  @IsNotEmpty({ message: '닉네임을 작성해주세요.' })
  @Column({
    type: 'varchar',
    length: 12,
    nullable: false,
  })
  nickname: string;

  @Exclude()
  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt?: Date | null;
}