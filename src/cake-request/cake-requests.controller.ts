import { Controller, Get, Post, Body, Param, Query, Patch, UseGuards, Req } from '@nestjs/common';
import { SupabaseAuthGuard } from 'src/common/guards/supabase-auth.guard';
import { RequirePlan } from 'src/common/decorator/require-plan.decorator';
import { PlanGuard } from 'src/common/guards/plan.guard';
import { CakeRequestsService } from './cake-requests.service';

@Controller('cake-requests')
export class CakeRequestsController {
  constructor(private readonly cakeRequestsService: CakeRequestsService) {}

  @Post()
  async create(@Body() body: any) {
    return this.cakeRequestsService.create(body);
  }

  @UseGuards(SupabaseAuthGuard)
  @Get()
  async findByBusiness(@Req() req: any) {
    const { id: businessId, plan } = req.business;
    return this.cakeRequestsService.findByBusiness(businessId, plan);
  }

  @UseGuards(SupabaseAuthGuard, PlanGuard)
  @RequirePlan('pro')
  @Get('followup')
  async findFollowUp(@Req() req: any) {
    return this.cakeRequestsService.findFollowUp(req.business.id);
  }

  @Patch(':id/price')
  async updatePrice(
    @Param('id') id: string,
    @Body() body: { finalPrice: number },
  ) {
    return this.cakeRequestsService.updatePrice(id, body.finalPrice);
  }
}