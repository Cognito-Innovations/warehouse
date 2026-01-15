import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface DeliveryOption {
  service_name: string;
  total_amount: number;
  estimated_days?: string;
  description?: string;
}

export interface DeliveryRatesResponse {
  success: boolean;
  data: DeliveryOption[];
}

@Injectable()
export class DeliveryFeeService {
  constructor(private readonly httpService: HttpService) {}

  getWeightInKg(unit_value: number, label: string): number {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel === 'kg') return unit_value;
    if (lowerLabel === 'g') return unit_value / 1000;
    if (lowerLabel === 'mg') return unit_value / 1000000;
    if (lowerLabel === 'lb' || lowerLabel === 'pound')
      return unit_value * 0.453592;
    if (lowerLabel === 'oz' || lowerLabel === 'ounce')
      return unit_value * 0.0283495;
    if (lowerLabel === 'ltr' || lowerLabel === 'liter') return unit_value;
    if (lowerLabel === 'ml') return unit_value / 1000;
    return unit_value;
  }

  async getDeliveryFee(weight: number, country_code: string): Promise<number> {
    const options = await this.getDeliveryOptions(weight, country_code);
    if (options.length > 0) {
      return options[0].total_amount;
    }
    return 2; // Fallback default
  }

  async getDeliveryOptions(
    weight: number,
    country_code: string,
  ): Promise<DeliveryOption[]> {
    const username = process.env.UGFLASH_USERNAME || 'UGAA01';
    const password = process.env.UGFLASH_PASSWORD || 'Ugflash@2022';

    if (!username || !password) {
      throw new BadRequestException('Shipment credentials not configured');
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post<DeliveryRatesResponse>(
          'https://ugflash.com/api/shipment/rates/list',
          {
            username,
            password,
            country_code,
            weight,
          },
        ),
      );

      if (response.data.success && response.data.data.length > 0) {
        return response.data.data.map((item) => ({
          service_name: item.service_name || 'Standard Delivery',
          total_amount: item.total_amount || 0,
          estimated_days: item.estimated_days,
          description: item.description,
        }));
      } else {
        throw new BadRequestException('No delivery options available');
      }
    } catch (error) {
      console.error('Failed to fetch delivery options:', error);
      // Return fallback options if API fails
      return [
        {
          service_name: 'Standard Delivery',
          total_amount: 2,
          estimated_days: '10-15 days',
          description: 'Standard shipping',
        },
      ];
    }
  }
}
