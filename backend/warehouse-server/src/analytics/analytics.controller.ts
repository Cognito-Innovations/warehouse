import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrives all dashboard and analytics data.',
  })
  async getDashboardMetrics(@Query('country_id') countryId?: string) {
    return this.analyticsService.getDashboardMetrics(countryId);
  }
}
