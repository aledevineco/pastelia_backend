import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';
import { Business } from 'src/entities/business.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Business])],
  providers: [SupabaseAuthGuard],
  exports: [SupabaseAuthGuard],
})
export class CommonModule {}