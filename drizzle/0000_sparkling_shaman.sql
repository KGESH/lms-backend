CREATE TABLE IF NOT EXISTS "user_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"provider_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_infos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"birth_date" text NOT NULL,
	"gender" text NOT NULL,
	"phone_number" text NOT NULL,
	"connecting_information" text NOT NULL,
	"duplication_information" text NOT NULL,
	CONSTRAINT "user_infos_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"display_name" text NOT NULL,
	"email" text NOT NULL,
	"password" text,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
