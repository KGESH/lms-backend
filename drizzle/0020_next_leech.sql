ALTER TABLE "orders" ADD COLUMN "tx_id" text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "payment_id" text;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_tx_id_unique" UNIQUE("tx_id");--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_payment_id_unique" UNIQUE("payment_id");