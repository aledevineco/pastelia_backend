import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RequirePlan } from "src/common/decorator/require-plan.decorator";
import { PlanGuard } from "src/common/guards/plan.guard";
import { SupabaseAuthGuard } from "src/common/guards/supabase-auth.guard";
import { Business } from "src/entities/business.entity";
import { Repository } from "typeorm";

@Controller('businesses')
export class BusinessesController{
    constructor(
        @InjectRepository(Business)
        private readonly businessesRepository: Repository<Business>
    ) {}

    @Post()
    async create(
        @Body()
        body: {
            userId: string;
            businessName: string;
            slug: string;
        }
    ) {
        const business = this.businessesRepository.create(body)
        return this.businessesRepository.save(business)
    }
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.businessesRepository.findOneBy({ id });
    }
    
    @UseGuards(SupabaseAuthGuard)
    @Get('me/profile')
    async getMyBusiness(@Req() req: any) {
        return req.business;
    }
    
    @UseGuards(SupabaseAuthGuard, PlanGuard)
    @RequirePlan('pro')
    @Get('me/pro-feature-test')
    async proFeatureTest(@Req() req: any) {
        return { message: 'Bienvenida, esta es una función exclusiva de Pro 🎉', business: req.business };
    }

    @Patch(':id/plan')
    async updatePlan(
        @Param('id') id: string,
        @Body() body: { plan: 'starter' | 'pro' },
    ) {
        await this.businessesRepository.update(id, { plan: body.plan });
        return this.businessesRepository.findOneBy({ id });
    }
}