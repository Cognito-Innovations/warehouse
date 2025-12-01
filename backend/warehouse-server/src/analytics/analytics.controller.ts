import { Controller, Get } from '@nestjs/common';
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
  async getDashboardMetrics() {
    return this.analyticsService.getDashboardMetrics();
  }
}
