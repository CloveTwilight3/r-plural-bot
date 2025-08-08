import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Warn {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reason: string;

  @Column()
  moderatorId: string;

  @Column()
  guildId: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.warns)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;
}