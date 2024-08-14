DO $$ BEGIN
 CREATE TYPE "public"."auth_provider" AS ENUM('email', 'kakao');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."user_role" AS ENUM('user', 'teacher', 'manager', 'admin');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DROP TABLE "teacher_infos";--> statement-breakpoint
ALTER TABLE "teachers" DROP CONSTRAINT "teachers_email_unique";--> statement-breakpoint
ALTER TABLE "user_infos" DROP CONSTRAINT "user_infos_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "course_product_snapshot_discounts" ALTER COLUMN "valid_from" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "course_product_snapshot_discounts" ALTER COLUMN "valid_to" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "course_product_snapshots" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "course_product_snapshots" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "course_product_snapshots" ALTER COLUMN "deleted_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "courses" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "user_accounts" ALTER COLUMN "provider_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "teachers" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "user_accounts" ADD COLUMN "provider_type" "auth_provider" NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "user_role" DEFAULT 'user' NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teachers" ADD CONSTRAINT "teachers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_accounts" ADD CONSTRAINT "user_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_infos" ADD CONSTRAINT "user_infos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "teachers" DROP COLUMN IF EXISTS "display_name";--> statement-breakpoint
ALTER TABLE "teachers" DROP COLUMN IF EXISTS "email";--> statement-breakpoint
ALTER TABLE "teachers" DROP COLUMN IF EXISTS "password";--> statement-breakpoint
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_user_id_unique" UNIQUE("user_id");