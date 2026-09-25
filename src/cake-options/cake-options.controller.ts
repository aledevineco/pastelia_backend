import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CakeOption } from "src/entities/cake-option.entity";
import { Repository } from "typeorm";

@Controller('cake-options')
export class CakeOptionsController {
    constructor(
        @InjectRepository(CakeOption)
        private readonly cakeOptionsRepository: Repository<CakeOption>,
    ) {}

    @Post()
    async create(
        @Body()
        body: {
            businessId: string;
            category: string;
            name: string;
            extraPrice?: number;
        }
    ) {
        const option = this.cakeOptionsRepository.create(body)
        return this.cakeOptionsRepository.save(option)
    }

    @Get()
    async findByBusiness(@Query('businessId') businessId: string) {
        return this.cakeOptionsRepository.find({ where: { businessId } });
    }

    @Get('grouped')
    async findGroupedByBusiness(@Query('businessId') businessId: string) {
        const options = await this.cakeOptionsRepository.find({
            where: { businessId, active: true },
        });

        return options.reduce((grouped, option) => {
            if (!grouped[option.category]) {
                grouped[option.category] = [];
                }
                grouped[option.category].push({
                id: option.id,
                name: option.name,
            });
            return grouped;
        }, {} as Record<string, any[]>);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.cakeOptionsRepository.findOneBy({ id });
    }
}