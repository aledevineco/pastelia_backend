import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Stripe from "stripe";

@Injectable()
export class StripeService {
    private stripe: Stripe;

    constructor(private configService: ConfigService){
        this.stripe = new Stripe(
            this.configService.get<string>('STRIPE_SECRET_KEY')
        );
    }
    async createCheckoutSession(params: {
        amount: number;
        currency: string;
        cakeRequestId: string;
        clientEmail?: string;
    }) {
        const session = await this.stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        customer_email: params.clientEmail,
        line_items: [
            {
            price_data: {
                currency: params.currency.toLowerCase(),
                product_data: {
                name: 'Anticipo de pastel personalizado',
                },
                unit_amount: Math.round(params.amount * 100), // Stripe usa centavos
            },
            quantity: 1,
            },
        ],
        // Stripe permite guardar datos extra para identificar el pago después
        metadata: {
            cakeRequestId: params.cakeRequestId,
        },
        success_url: 'https://tu-dominio.com/pago-exitoso?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: 'https://tu-dominio.com/pago-cancelado',
        });

        return session;
    }

    getStripeInstance() {
        return this.stripe;
    }

    constructEvent(payload: Buffer, signature: string) {
        const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
        return this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    }
}