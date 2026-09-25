import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CakeOption } from "src/entities/cake-option.entity";
import { CakeOptionsController } from "./cake-options.controller";

@Module({
    imports: [ TypeOrmModule.forFeature([CakeOption]) ],
    controllers: [ CakeOptionsController ],
    exports: [TypeOrmModule]
})

export class CakeOptionsModule {}