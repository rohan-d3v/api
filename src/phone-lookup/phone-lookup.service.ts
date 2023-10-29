import { Injectable, HttpException } from '@nestjs/common';
import { PhoneLookupDto, PhoneLookupResponseDto } from './dto/phone-lookup.dto';
import axios from 'axios';

@Injectable()
export class PhoneLookupService {
  async findOne(
    phoneLookupDto: PhoneLookupDto,
  ): Promise<PhoneLookupResponseDto> {
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
): Promise<PhoneLookupResponseDto> => {
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

    const city =
      response.data.addresses.length > 0 ? response.data.addresses[0].city : '';
    const email =
      response.data.internetAddresses.length > 0
        ? response.data.internetAddresses[0].id
        : '';
    const name = response.data.name || '';
    const phoneDetailsArr = [];

    for (const phoneDetails of response.data.phones) {
      const phoneDetailsObj = {
        phone: phoneDetails.e164Format,
        type: phoneDetails.numberType,
        carrier: phoneDetails.carrier,
      };
      phoneDetailsArr.push(phoneDetailsObj);
    }

    const phoneLookupResponseDto = {
      name: name,
      email,
      city,
      phoneDetails: phoneDetailsArr,
    };

    return phoneLookupResponseDto;
  } catch (error) {
    throw error;
  }
};
