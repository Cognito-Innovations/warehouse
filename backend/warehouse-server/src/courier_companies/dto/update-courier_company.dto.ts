import { PartialType } from '@nestjs/swagger';
import { CreateCourierCompanyDto } from './create-courier_company.dto';

export class UpdateCourierCompanyDto extends PartialType(
  CreateCourierCompanyDto,
) {}
