CREATE TABLE IF NOT EXISTS "course_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_id" uuid,
	"name" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "course_discounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_pricing_id" uuid NOT NULL,
	"discount_type" text NOT NULL,
	"value" numeric NOT NULL,
	"valid_from" date,
	"valid_to" date
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "course_pricing" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"course_id" uuid NOT NULL,
	"amount" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"teacher_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"created_at" date NOT NULL,
	"updated_at" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teacher_infos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"teacher_id" uuid NOT NULL,
	"name" text NOT NULL,
	"birth_date" text NOT NULL,
	"gender" text NOT NULL,
	"phone_number" text NOT NULL,
	"connecting_information" text NOT NULL,
	"duplication_information" text NOT NULL,
	CONSTRAINT "teacher_infos_teacher_id_unique" UNIQUE("teacher_id"),
	CONSTRAINT "teacher_infos_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teachers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"display_name" text NOT NULL,
	"email" text NOT NULL,
	"password" text,
	CONSTRAINT "teachers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "user_infos" ADD CONSTRAINT "user_infos_user_id_unique" UNIQUE("user_id");