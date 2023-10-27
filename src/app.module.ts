import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CostOfLivingModule } from './cost-of-living/cost-of-living.module';
import { PhoneLookupModule } from './phone-lookup/phone-lookup.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot(), CostOfLivingModule, PhoneLookupModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
