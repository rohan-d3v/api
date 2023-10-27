import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  CostOfLivingInputDto,
  CostOfLivingOutputDto,
} from './dto/cost-of-living.dto';

@Injectable()
export class CostOfLivingService {
  async calculateCostOfLiving(
    costOfLivingInputDto: CostOfLivingInputDto,
  ): Promise<CostOfLivingOutputDto> {
    const { sourceCountryCode, destinationCountryCode } =
      await getCountryCodesFromWB(
        costOfLivingInputDto.sourceCountry,
        costOfLivingInputDto.targetCountry,
      );

    const [
      {
        dataLastUpdated: dataLastUpdated,
        countryUpdatedDate: sourceCountryUpdateDate,
        countryPPP: sourceCountryPPP,
      },
      {
        countryUpdatedDate: destinationCountryUpdateDate,
        countryPPP: destinationCountryPPP,
      },
    ] = await Promise.all([
      getCountryPPPFromWB(sourceCountryCode),
      getCountryPPPFromWB(destinationCountryCode),
    ]);

    const costOfLiving =
      costOfLivingInputDto.sourceIncome *
      (destinationCountryPPP / sourceCountryPPP);

    const responseObj = {
      lastUpdated: dataLastUpdated,
      source: {
        country: costOfLivingInputDto.sourceCountry,
        lastUpdated: sourceCountryUpdateDate,
        code: sourceCountryCode,
        ppp: sourceCountryPPP,
      },
      target: {
        country: costOfLivingInputDto.targetCountry,
        lastUpdated: destinationCountryUpdateDate,
        code: destinationCountryCode,
        ppp: destinationCountryPPP,
      },
      equivalentIncome: costOfLiving,
    };

    return responseObj;
  }
}

// Helper Functions
export const getCountryCodesFromWB = async (
  sourceCountry,
  destinationCountry,
) => {
  try {
    const response = await axios.get(
      'http://api.worldbank.org/v2/country?format=json&per_page=500',
    );

    const countries = response.data[1];
    const sourceCountryCode = countries.filter(
      (country) => country.name === sourceCountry,
    )[0].id;
    const destinationCountryCode = countries.filter(
      (country) => country.name === destinationCountry,
    )[0].id;
    return { sourceCountryCode, destinationCountryCode };
  } catch (error) {
    console.error(error);
  }
};

export const getCountryPPPFromWB = async (countryCode) => {
  try {
    const response = await axios.get(
      `http://api.worldbank.org/v2/country/${countryCode}/indicator/PA.NUS.PPP?format=json`,
    );

    const dataLastUpdated = response.data[0].lastupdated;

    if (response.data[1].length > 0) {
      return {
        dataLastUpdated: dataLastUpdated,
        countryPPP: response.data[1][0].value,
        countryUpdatedDate: response.data[1][0].date,
      };
    }
    return {
      dataLastUpdated: dataLastUpdated,
      countryPPP: 0,
      countryUpdatedDate: '',
    };
  } catch (error) {
    console.error(error);
  }
};
