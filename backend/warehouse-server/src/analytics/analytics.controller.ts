import { Controller, Get, Req } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import type { AuthenticatedRequest } from 'src/shared/types/authenticated-request.type';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  @ApiOkResponse({
    description: 'Retrives all dashboard and analytics data.',
  })
  async getDashboardMetrics(@Req() req: AuthenticatedRequest) {
    return this.analyticsService.getDashboardMetrics(req.user.id);
  }
}
