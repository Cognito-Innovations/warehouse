import { BadRequestException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

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
    // const username = process.env.UGFLASH_USERNAME;
    // const password = process.env.UGFLASH_PASSWORD;

    // if (!username || !password) {
    //   throw new BadRequestException('Shipment credentials not configured');
    // }

    // const response = await firstValueFrom(
    //   this.httpService.post<{
    //     success: boolean;
    //     data: { total_amount: number }[];
    //   }>('https://ugflash.com/api/shipment/rates/list', {
    //     username,
    //     password,
    //     country_code,
    //     weight,
    //   }),
    // );

    // if (response.data.success && response.data.data.length > 0) {
    //   return response.data.data[0].total_amount;
    // } else {
    //   throw new BadRequestException('Failed to get delivery fee');
    // }

    return 2;
  }
}
