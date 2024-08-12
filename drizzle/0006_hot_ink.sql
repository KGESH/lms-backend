ALTER TABLE "user_infos" ALTER COLUMN "birth_date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_infos" ALTER COLUMN "gender" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_infos" ALTER COLUMN "phone_number" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_infos" ALTER COLUMN "connecting_information" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user_infos" ALTER COLUMN "duplication_information" DROP NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_infos" ADD CONSTRAINT "user_infos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
