import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { OrdersModule } from '../orders/orders.module';
import { Payment } from 'src/entities/payment.entity';
import { CakeRequest } from 'src/entities/cake-request';
import { StripeService } from './stripe.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, CakeRequest]), 
    OrdersModule, 
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, StripeService],
  exports: [TypeOrmModule],
})
export class PaymentsModule {}