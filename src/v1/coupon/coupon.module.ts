import { Module } from '@nestjs/common';

const modules = [];

const providers = [];

@Module({
  imports: [...modules],
  controllers: [],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class CouponModule {}
