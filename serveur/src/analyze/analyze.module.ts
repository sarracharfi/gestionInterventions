import { Module } from '@nestjs/common';
import { AnalyzeService } from './analyze.service';
import { AnalyzeController } from './analyze.controller';
import { CloudflareModule } from '../cloudflare/cloudflare.module';  
@Module({
  imports: [CloudflareModule],          
  controllers: [AnalyzeController],
  providers: [AnalyzeService],          
})
export class AnalyzeModule {}
