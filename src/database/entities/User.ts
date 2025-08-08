import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Warn } from './Warn';
import { Ban } from './Ban';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  discordId: string;

  @Column()
  username: string;

  @Column({ default: 0 })
  warnCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Warn, warn => warn.user)
  warns: Warn[];

  @OneToMany(() => Ban, ban => ban.user)
  bans: Ban[];
}