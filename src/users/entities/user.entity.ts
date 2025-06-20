import { RefreshToken } from "src/auth/entities/refresh-token.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { UserProfile } from "./user-profile.entity";
import { Permission } from "src/users/entities/permission.entity";

export enum UserRole {
  ADMIN = 'admin',
  CLIENT = 'client',
  OWNER = 'owner',
}

@Entity()
export class User {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.CLIENT })
  role: UserRole;

  @OneToOne(() => UserProfile, profile => profile.user, { cascade: true })
  profile: UserProfile;

  @ManyToMany(() => Permission, permission => permission.users)
  @JoinTable()
  permissions: Permission[];

  @OneToMany(() => RefreshToken, (rt) => rt.user)
  refreshTokens: RefreshToken[];

}