import { Test, TestingModule } from '@nestjs/testing';
import { CourierCompaniesService } from './courier_companies.service';

describe('CourierCompaniesService', () => {
  let service: CourierCompaniesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourierCompaniesService],
    }).compile();

    service = module.get<CourierCompaniesService>(CourierCompaniesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
