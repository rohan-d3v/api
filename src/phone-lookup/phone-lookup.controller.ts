import { Controller, Post, Body } from '@nestjs/common';
import { PhoneLookupService } from './phone-lookup.service';
import { PhoneLookupDto, PhoneLookupResponseDto } from './dto/phone-lookup.dto';

@Controller('phone-lookup')
export class PhoneLookupController {
  constructor(private readonly phoneLookupService: PhoneLookupService) {}

  @Post()
  async create(
    @Body() phoneLookupDto: PhoneLookupDto,
  ): Promise<PhoneLookupResponseDto> {
    return await this.phoneLookupService.findOne(phoneLookupDto);
  }
}
