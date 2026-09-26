import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CakeRequest } from 'src/entities/cake-request';
import { Repository } from 'typeorm';

@Injectable()
export class CakeRequestsService {
  constructor(
    @InjectRepository(CakeRequest)
    private readonly cakeRequestsRepository: Repository<CakeRequest>,
  ) {}

  async create(body: Partial<CakeRequest>) {
    const request = this.cakeRequestsRepository.create(body);
    return this.cakeRequestsRepository.save(request);
  }

  async findOne(id: string) {
    return this.cakeRequestsRepository.findOneBy({ id });
  }

  async updatePrice(id: string, finalPrice: number) {
    await this.cakeRequestsRepository.update(id, { finalPrice });
    return this.cakeRequestsRepository.findOneBy({ id });
  }

  // Lista principal: respeta la regla de 48h según el plan del negocio
  async findByBusiness(businessId: string, plan: string) {
    if (plan === 'pro') {
      // Pro ve TODO, sin importar cuánto tiempo lleve pendiente
      return this.cakeRequestsRepository.find({
        where: { businessId },
        order: { createdAt: 'DESC' },
      });
    }

    // Starter: solo ve lo que NO ha expirado (pending + dentro de 48h) o lo que ya se pagó/entregó
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);

    return this.cakeRequestsRepository
      .createQueryBuilder('cr')
      .where('cr.businessId = :businessId', { businessId })
      .andWhere(
        '(cr.status != :pending OR cr.createdAt > :cutoff)',
        { pending: 'pending', cutoff },
      )
      .orderBy('cr.createdAt', 'DESC')
      .getMany();
  }

  // Exclusivo Pro: solicitudes "perdidas" (pending + vencidas)
  async findFollowUp(businessId: string) {
    const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);

    return this.cakeRequestsRepository
      .createQueryBuilder('cr')
      .where('cr.businessId = :businessId', { businessId })
      .andWhere('cr.status = :pending', { pending: 'pending' })
      .andWhere('cr.createdAt <= :cutoff', { cutoff })
      .orderBy('cr.createdAt', 'DESC')
      .getMany();
  }
}