import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryColumn('text')
  address!: string;

  @Column('text', { nullable: false })
  message!: string;
  @Column('text', { nullable: true })
  token: string | undefined;
  @Column('text', { nullable: true })
  refreshToken: string | undefined;
}
