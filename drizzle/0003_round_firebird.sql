DO $$ BEGIN
 ALTER TABLE "coupon_ticket_payments" ADD CONSTRAINT "coupon_ticket_payments_coupon_ticket_id_coupon_tickets_id_fk" FOREIGN KEY ("coupon_ticket_id") REFERENCES "public"."coupon_tickets"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
