import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Business } from "src/entities/business.entity";
import { BusinessesController } from "./businesses.controller";

@Module({
  imports: [ TypeOrmModule.forFeature([Business]) ],
  controllers: [ BusinessesController ],
  exports: [ TypeOrmModule ],
})

export class BusinessModule {}