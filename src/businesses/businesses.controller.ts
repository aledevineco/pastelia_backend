import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
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
        return req.business; // el Guard ya dejó esto listo
    }
}