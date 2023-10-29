import { IsNotEmpty, IsString } from 'class-validator';

export class PhoneLookupDto {
  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  country: string;
}

export class PhoneLookupResponseDto {
  name: string;
  email: string;
  city: string;
  phoneDetails: PhoneDetailsDto[];
}

export class PhoneDetailsDto {
  phone: string;
  type: string;
  carrier: string;
}
