import { IsNotEmpty, IsString } from 'class-validator';

export class PhoneLookupDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  country: string;
}
