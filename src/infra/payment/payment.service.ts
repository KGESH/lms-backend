import { Injectable, Logger } from '@nestjs/common';
import { ConfigsService } from '@src/configs/configs.service';
import { PortoneApiService } from '@src/infra/payment/portone-api.service';
import * as typia from 'typia';
import {
  PortonePaymentResult,
  PortoneSucceededPaymentCancellation,
} from '@src/infra/payment/portone-api.types';
import * as decimal from '@src/shared/utils/decimal';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  constructor(
    private readonly api: PortoneApiService,
    private readonly configsService: ConfigsService,
  ) {}

  /**
   * @description
   * PG사 결제 결과 조회
   */
  async getPgPaymentResult(paymentId: string): Promise<PortonePaymentResult> {
    try {
      const endpoint = new URL(
        `/payments/${paymentId}`,
        this.configsService.env.PORTONE_API_BASE_URL,
      );

      const data = await this.api.get(endpoint.href);

      this.logger.log(`[Port One Payment Result]`, data);

      const paymentResult = typia.assert<PortonePaymentResult>(data);

      return paymentResult;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  verifyPaymentOrThrow({
    pgAmount,
    appAmount,
  }: {
    pgAmount: number | string;
    appAmount: number | string;
  }) {
    if (!decimal.isSame(pgAmount, appAmount)) {
      throw new Error(
        `Payment amount mismatch. Reserved: ${appAmount} | Amount: ${pgAmount}`,
      );
    }
  }

  async refundPgPayment({
    paymentId,
    reason,
    refundAmount,
  }: {
    paymentId: string;
    reason: string;
    refundAmount?: number; // If not provided, refund all
  }): Promise<PortoneSucceededPaymentCancellation> {
    try {
      const endpoint = new URL(
        `/payments/${paymentId}/cancel`,
        this.configsService.env.PORTONE_API_BASE_URL,
      );

      const body = {
        reason,
        refundAmount,
      };

      const data = await this.api.post(endpoint.href, body);

      const refundResult =
        typia.assert<PortoneSucceededPaymentCancellation>(data);

      return refundResult;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
