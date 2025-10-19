import { PartialType } from '@nestjs/swagger';
import { CreateEcommerceDto } from './create-ecommerce.dto';

export class UpdateEcommerceDto extends PartialType(CreateEcommerceDto) {}
