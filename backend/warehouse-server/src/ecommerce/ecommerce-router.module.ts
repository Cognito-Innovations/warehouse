import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { EcommerceModule } from './ecommerce.module';

//This router module helps us to prefix all the controllers routes with /ecommerce
@Module({
  imports: [
    EcommerceModule,
    RouterModule.register([
      {
        path: 'ecommerce',
        module: EcommerceModule,
      },
    ]),
  ],
})
export class EcommerceRouterModule {}
