import { PrimaryGeneratedColumn } from 'typeorm';
import { TimestampedEntity } from './TimestampedEntity';

export abstract class BaseEntity extends TimestampedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}