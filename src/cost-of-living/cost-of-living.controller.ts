import {
  Controller,
  Post,
  Body,
  // HttpException,
  // HttpStatus,
} from '@nestjs/common';
import { CostOfLivingService } from './cost-of-living.service';
import {
  CostOfLivingInputDto,
  CostOfLivingOutputDto,
} from './dto/cost-of-living.dto';

@Controller('cost-of-living')
export class CostOfLivingController {
  constructor(private readonly costOfLivingService: CostOfLivingService) {}

  @Post()
  async calculateCOL(
    @Body() costOfLivingInputDto: CostOfLivingInputDto,
  ): Promise<CostOfLivingOutputDto> {
    return await this.costOfLivingService.calculateCostOfLiving(
      costOfLivingInputDto,
    );
  }
}
