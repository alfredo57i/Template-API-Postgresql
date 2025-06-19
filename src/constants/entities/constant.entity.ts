import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('constants')
@Unique(['key', 'id']) 
@Unique(['key', 'value'])
export class Constant {
  @PrimaryGeneratedColumn()
  internalId: number;

  @Column()
  key: string;

  @Column()
  value: string;

  @Column()
  id: number;
}