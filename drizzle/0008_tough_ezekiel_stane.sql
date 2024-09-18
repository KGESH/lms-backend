CREATE TABLE IF NOT EXISTS "coupon_all_criteria" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"coupon_id" uuid NOT NULL,
	"type" "coupon_criteria_type" NOT NULL,
	"direction" "coupon_direction" NOT NULL
);
