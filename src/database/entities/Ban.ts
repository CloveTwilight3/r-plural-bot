import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Ban {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  reason: string;

  @Column()
  moderatorId: string;

  @Column()
  guildId: string;

  @Column({ nullable: true })
  expiresAt: Date;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, user => user.bans)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;
}