import { Injectable, HttpException } from '@nestjs/common';
import { PhoneLookupDto } from './dto/phone-lookup.dto';
import axios from 'axios';

@Injectable()
export class PhoneLookupService {
  async findOne(phoneLookupDto: PhoneLookupDto) {
    try {
      const response = await performTruecallerSearch(phoneLookupDto);
      return response;
    } catch (error) {
      throw new HttpException(
        {
          status: error.response.status,
          message: error.message,
        },
        error.response.status,
      );
    }
  }
}

export const performTruecallerSearch = async (
  phoneLookupDto: PhoneLookupDto,
) => {
  try {
    const response = await axios.get(
      'https://asia-south1-truecaller-web.cloudfunctions.net/api/noneu/search/v1',
      {
        params: {
          q: phoneLookupDto.phone,
          countryCode: phoneLookupDto.country.toLowerCase(),
          type: 40,
        },
        headers: {
          authorization: `Bearer ${process.env.TRUECALLER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response;
  } catch (error) {
    throw error;
  }
};
