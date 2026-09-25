import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './entity-utilites/BaseEntity';
import { Business } from './business.entity';
import { CakeRequest } from './cake-request';

@Entity('payments')
export class Payment extends BaseEntity {
  @Column({ name: 'business_id', type: 'uuid' })
  businessId: string;

  @ManyToOne(() => Business)
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @Column({ name: 'cake_request_id', type: 'uuid' })
  cakeRequestId: string;

  @ManyToOne(() => CakeRequest)
  @JoinColumn({ name: 'cake_request_id' })
  cakeRequest: CakeRequest;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({ type: 'varchar', length: 30 })
  provider: string; // stripe | mercado_pago

  @Column({ name: 'provider_payment_id', type: 'varchar', length: 150, nullable: true })
  providerPaymentId: string;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: string; // pending | paid | failed | expired

  @Column({ name: 'paid_at', type: 'timestamp', nullable: true })
  paidAt: Date;
}