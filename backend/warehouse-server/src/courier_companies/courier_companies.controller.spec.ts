import { Test, TestingModule } from '@nestjs/testing';
import { CourierCompaniesController } from './courier_companies.controller';
import { CourierCompaniesService } from './courier_companies.service';

describe('CourierCompaniesController', () => {
  let controller: CourierCompaniesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourierCompaniesController],
      providers: [CourierCompaniesService],
    }).compile();

    controller = module.get<CourierCompaniesController>(
      CourierCompaniesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
