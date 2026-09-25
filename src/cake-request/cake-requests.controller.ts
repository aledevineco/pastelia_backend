import { Controller, Get, Post, Body, Param, Query, Patch } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CakeRequest } from 'src/entities/cake-request';
import { Repository } from 'typeorm';

@Controller('cake-requests')
export class CakeRequestsController {
  constructor(
    @InjectRepository(CakeRequest)
    private readonly cakeRequestsRepository: Repository<CakeRequest>,
  ) {}

  @Post()
  async create(@Body() body: Partial<CakeRequest>) {
    const request = this.cakeRequestsRepository.create(body);
    return this.cakeRequestsRepository.save(request);
  }

  @Get()
  async findByBusiness(@Query('businessId') businessId: string) {
    return this.cakeRequestsRepository.find({ where: { businessId } });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.cakeRequestsRepository.findOneBy({ id });
  }
  @Patch(':id/price')
  async updatePrice(
    @Param('id') id: string,
    @Body() body: { finalPrice: number },
  ) {
    await this.cakeRequestsRepository.update(id, {
      finalPrice: body.finalPrice,
    });
    return this.cakeRequestsRepository.findOneBy({ id });
  }
}