import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CakeRequest } from 'src/entities/cake-request';
import { CakeRequestsController } from './cake-requests.controller';
import { CakeRequestsService } from './cake-requests.service';

@Module({
  imports: [TypeOrmModule.forFeature([CakeRequest])],
  controllers: [CakeRequestsController],
  providers: [CakeRequestsService],
  exports: [TypeOrmModule],
})
export class CakeRequestsModule {}