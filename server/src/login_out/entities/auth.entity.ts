import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('Auth')
export class AuthEntity {
  @PrimaryColumn()
  intra_id: string;

  @Column()
  auth_token: string;
}
