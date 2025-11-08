import { Controller, Post, Delete, Query } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Public()
  @Post('ecommerce')
  async seedEcommerce() {
    const result = await this.seedService.seedAll();
    return {
      message: 'Ecommerce data seeded successfully',
      ...result,
    };
  }

  @Public()
  @Delete('ecommerce')
  async cleanupSeedData(
    @Query('deleteOrderItems') deleteOrderItems?: string,
  ) {
    const shouldDeleteOrderItems = deleteOrderItems === 'true';
    const result = await this.seedService.cleanupSeedData(
      shouldDeleteOrderItems,
    );
    return result;
  }
}

