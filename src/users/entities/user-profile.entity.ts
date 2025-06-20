import { Column, Entity, OneToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  profileImageUrl: string;

  @OneToOne(() => User, user => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  @Exclude()
  user: User;
}