import { Module } from '@nestjs/common';
import { PaymentService } from '@src/infra/payment/payment.service';
import { HttpClientModule } from '@src/infra/http/http-client.module';
import { PortoneApiService } from '@src/infra/payment/portone-api.service';

const modules = [HttpClientModule];

const providers = [PortoneApiService, PaymentService];

@Module({
  imports: [...modules],
  providers: [...providers],
  exports: [...modules, ...providers],
})
export class PaymentModule {}
