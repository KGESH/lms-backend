DO $$ BEGIN
 CREATE TYPE "public"."policy_type" AS ENUM('terms_of_service', 'privacy');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "policies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" "policy_type" NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "policy_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"policy_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"content" text NOT NULL,
	"updated_reason" text,
	"metadata" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "policy_snapshots" ADD CONSTRAINT "policy_snapshots_policy_id_policies_id_fk" FOREIGN KEY ("policy_id") REFERENCES "public"."policies"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_policies_type" ON "policies" USING btree ("type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_policy_snapshots_policy_id" ON "policy_snapshots" USING btree ("policy_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_policy_snapshots_created_at" ON "policy_snapshots" USING btree ("created_at");