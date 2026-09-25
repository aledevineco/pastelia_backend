import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CakeRequest } from 'src/entities/cake-request';
import { CakeRequestsController } from './cake-requests.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CakeRequest])],
  controllers: [CakeRequestsController],
  exports: [TypeOrmModule],
})
export class CakeRequestsModule {}