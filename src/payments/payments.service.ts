import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdersService } from '../orders/orders.service';
import { StripeService } from './stripe.service';
import { Payment } from 'src/entities/payment.entity';
import { CakeRequest } from 'src/entities/cake-request';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
    @InjectRepository(CakeRequest)
    private readonly cakeRequestsRepository: Repository<CakeRequest>,
    private readonly ordersService: OrdersService,
    private readonly stripeService: StripeService,
  ) {}

  async createCheckout(cakeRequestId: string) {
    const cakeRequest = await this.cakeRequestsRepository.findOneBy({
      id: cakeRequestId,
    });
    if (!cakeRequest) {
      throw new NotFoundException('Cake request not found');
    }
    if (!cakeRequest.finalPrice) {
      throw new NotFoundException('Esta solicitud aún no tiene precio final');
    }

    const payment = this.paymentsRepository.create({
      businessId: cakeRequest.businessId,
      cakeRequestId: cakeRequest.id,
      amount: cakeRequest.finalPrice,
      currency: 'USD',
      provider: 'stripe',
      status: 'pending',
    });
    await this.paymentsRepository.save(payment);

    const session = await this.stripeService.createCheckoutSession({
      amount: cakeRequest.finalPrice,
      currency: 'USD',
      cakeRequestId: cakeRequest.id,
      clientEmail: cakeRequest.email,
    });

    payment.providerPaymentId = session.id;
    await this.paymentsRepository.save(payment);

    return {
      paymentId: payment.id,
      checkoutUrl: session.url,
    };
  }

  async findOne(id: string) {
    return this.paymentsRepository.findOneBy({ id });
  }

  private async confirm(id: string, providerPaymentId: string) {
    const payment = await this.paymentsRepository.findOneBy({ id });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    payment.status = 'paid';
    payment.providerPaymentId = providerPaymentId;
    payment.paidAt = new Date();
    await this.paymentsRepository.save(payment);

    const cakeRequest = await this.cakeRequestsRepository.findOneBy({
      id: payment.cakeRequestId,
    });
    if (!cakeRequest) {
      throw new NotFoundException('Cake request not found');
    }

    cakeRequest.status = 'approved_paid';
    cakeRequest.paidAt = new Date();
    await this.cakeRequestsRepository.save(cakeRequest);

    const order = await this.ordersService.createFromPayment(payment, cakeRequest);

    return { payment, order };
  }

  async handleWebhookEvent(payload: Buffer, signature: string) {
    const event = this.stripeService.constructEvent(payload, signature);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;

      const payment = await this.paymentsRepository.findOneBy({
        providerPaymentId: session.id,
      });

      if (!payment) {
        throw new NotFoundException('Payment not found for this session');
      }

      return this.confirm(payment.id, session.payment_intent);
    }

    return { received: true };
  }
}