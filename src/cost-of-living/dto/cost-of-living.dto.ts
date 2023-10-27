import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CostOfLivingInputDto {
  @IsString()
  @IsNotEmpty()
  sourceCountry: string;

  @IsString()
  @IsNotEmpty()
  targetCountry: string;

  @IsNumber()
  @IsNotEmpty()
  sourceIncome: number;
}

export class CountryDetailsDto {
  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  lastUpdated: string;

  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsNumber()
  ppp: number;
}

export class CostOfLivingOutputDto {
  @IsNotEmpty()
  @IsString()
  lastUpdated: string;

  @IsNotEmpty()
  source: CountryDetailsDto;

  @IsNotEmpty()
  target: CountryDetailsDto;

  @IsNotEmpty()
  @IsNumber()
  equivalentIncome: number;
}
