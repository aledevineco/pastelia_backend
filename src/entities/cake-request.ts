import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Business } from './business.entity';
import { BaseEntity } from './entity-utilites/BaseEntity';

@Entity('cake_requests')
export class CakeRequest extends BaseEntity {
  @Column({ name: 'business_id', type: 'uuid' })
  businessId: string;

  @ManyToOne(() => Business)
  @JoinColumn({ name: 'business_id' })
  business: Business;

  // ---- client info ----
  @Column({ name: 'client_name', type: 'varchar', length: 150 })
  clientName: string;

  @Column({ type: 'varchar', length: 20 })
  cellphone: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  email: string;

  // ---- event & delivery ----
  @Column({ name: 'event_date', type: 'date' })
  eventDate: string;

  @Column({ name: 'cake_ready_date', type: 'date' })
  cakeReadyDate: string;

  @Column({ name: 'delivery_method', type: 'varchar', length: 20 })
  deliveryMethod: string; // pickup | delivery

  @Column({ name: 'delivery_address', type: 'varchar', length: 255, nullable: true })
  deliveryAddress: string;

  // ---- cake characteristics ----
  @Column({ type: 'int' })
  servings: number;

  @Column({ name: 'tiers_size', type: 'varchar', length: 150, nullable: true })
  tiersSize: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  flavor: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  filling: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  coverage: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  shape: string; // round | square | heart | number | other

  // ---- design & decoration ----
  @Column({ name: 'event_type', type: 'varchar', length: 50, nullable: true })
  eventType: string; // wedding | baptism | birthday | other

  @Column({ type: 'varchar', length: 100, nullable: true })
  color: string;

  @Column({ name: 'design_notes', type: 'text', nullable: true })
  designNotes: string;

  @Column({ name: 'extras_notes', type: 'text', nullable: true })
  extrasNotes: string;

  // ---- allergies & preferences ----
  @Column({ type: 'text', nullable: true })
  allergies: string;

  @Column({ name: 'special_preferences', type: 'text', nullable: true })
  specialPreferences: string;

  // ---- policy ----
  @Column({ name: 'accepted_policy', type: 'boolean', default: false })
  acceptedPolicy: boolean;

  // ---- flow & status ----
  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string; // pending | approved_paid | delivered | expired

  @Column({ name: 'internal_notes', type: 'text', nullable: true })
  internalNotes: string;

  @Column({
    name: 'final_price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  finalPrice: number;

  @Column({ name: 'paid_at', type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt: Date;
}