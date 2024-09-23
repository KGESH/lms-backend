ALTER TABLE "signup_terms" ADD COLUMN "sequence" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "terms" DROP COLUMN IF EXISTS "required";--> statement-breakpoint
ALTER TABLE "signup_terms" ADD CONSTRAINT "signup_terms_sequence_unique" UNIQUE("sequence");