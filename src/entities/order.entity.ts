import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './entity-utilites/BaseEntity';
import { Business } from './business.entity';
import { CakeRequest } from './cake-request';
import { Payment } from './payment.entity';

@Entity('orders')
export class Order extends BaseEntity {
  @Column({ name: 'business_id', type: 'uuid' })
  businessId: string;

  @ManyToOne(() => Business)
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @Column({ name: 'cake_request_id', type: 'uuid', unique: true })
  cakeRequestId: string;

  @ManyToOne(() => CakeRequest)
  @JoinColumn({ name: 'cake_request_id' })
  cakeRequest: CakeRequest;

  @Column({ name: 'payment_id', type: 'uuid' })
  paymentId: string;

  @ManyToOne(() => Payment)
  @JoinColumn({ name: 'payment_id' })
  payment: Payment;

  @Column({ name: 'order_number', type: 'varchar', length: 20, unique: true })
  orderNumber: string;

  @Column({ name: 'delivery_date', type: 'date' })
  deliveryDate: string;

  @Column({ name: 'total_price', type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ type: 'varchar', length: 20, default: 'in_production' })
  status: string; // in_production | ready | delivered | cancelled

  @Column({ name: 'delivered_at', type: 'timestamp', nullable: true })
  deliveredAt: Date;
}