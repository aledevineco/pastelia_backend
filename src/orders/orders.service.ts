import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CakeRequest } from 'src/entities/cake-request';
import { Order } from 'src/entities/order.entity';
import { Payment } from 'src/entities/payment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  async createFromPayment(
    payment: Payment,
    cakeRequest: CakeRequest,
  ): Promise<Order> {
    const orderNumber = await this.generateOrderNumber(payment.businessId);

    const order = this.ordersRepository.create({
      businessId: payment.businessId,
      cakeRequestId: cakeRequest.id,
      paymentId: payment.id,
      orderNumber,
      deliveryDate: cakeRequest.cakeReadyDate,
      totalPrice: payment.amount,
      status: 'in_production',
    });

    return this.ordersRepository.save(order);
  }

  private async generateOrderNumber(businessId: string): Promise<string> {
    const count = await this.ordersRepository.count({ where: { businessId } });
    const next = count + 1;
    return `ORD-${next.toString().padStart(4, '0')}`;
  }

  async findByBusiness(businessId: string) {
    return this.ordersRepository.find({ where: { businessId } , 
    relations: {
      cakeRequest: true,
      payment: true,
    },
    } );
  }

  async findOne(id: string) {
  return this.ordersRepository.findOne({
    where: { id },
    relations: {
      cakeRequest: true,
      payment: true,
    },
  });
}
}