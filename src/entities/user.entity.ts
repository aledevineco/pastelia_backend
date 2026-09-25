import { Entity, PrimaryColumn, Column } from 'typeorm';
import { TimestampedEntity } from './entity-utilites/TimestampedEntity';

@Entity('users')
export class User extends TimestampedEntity {
  @PrimaryColumn('uuid')
  id: string; // mismo id que Supabase Auth (auth.users.id), no se autogenera aquí

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string; // active | inactive | suspended
}