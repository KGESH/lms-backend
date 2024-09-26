CREATE TABLE IF NOT EXISTS "ui_banners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ui_component_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"link_url" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ui_banners" ADD CONSTRAINT "ui_banners_ui_component_id_ui_components_id_fk" FOREIGN KEY ("ui_component_id") REFERENCES "public"."ui_components"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
