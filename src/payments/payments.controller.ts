import { Controller, Get, Post, Body, Param, Patch, Req, Headers } from '@nestjs/common';
import { Request } from 'express';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('checkout')
  async createCheckout(@Body() body: { cakeRequestId: string }) {
    return this.paymentsService.createCheckout(body.cakeRequestId);
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.paymentsService.handleWebhookEvent(req.body, signature);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }
}