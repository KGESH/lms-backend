ALTER TABLE "signup_terms" DROP CONSTRAINT "signup_terms_sequence_unique";--> statement-breakpoint
ALTER TABLE "signup_terms" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "signup_terms" ADD COLUMN "deleted_at" timestamp with time zone;