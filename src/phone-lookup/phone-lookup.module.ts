import { Module } from '@nestjs/common';
import { PhoneLookupService } from './phone-lookup.service';
import { PhoneLookupController } from './phone-lookup.controller';

@Module({
  controllers: [PhoneLookupController],
  providers: [PhoneLookupService],
})
export class PhoneLookupModule {}
