ALTER TABLE "signup_terms" DROP CONSTRAINT "signup_terms_term_id_terms_id_fk";
--> statement-breakpoint
ALTER TABLE "term_snapshots" DROP CONSTRAINT "term_snapshots_term_id_terms_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "signup_terms" ADD CONSTRAINT "signup_terms_term_id_terms_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."terms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "term_snapshots" ADD CONSTRAINT "term_snapshots_term_id_terms_id_fk" FOREIGN KEY ("term_id") REFERENCES "public"."terms"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
