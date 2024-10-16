ALTER TYPE "ui_categories" ADD VALUE 'popup';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ui_popups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ui_component_id" uuid NOT NULL,
	"title" text NOT NULL,
	"rich_text_content" text NOT NULL,
	"button_label" text,
	"link_url" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ui_popups" ADD CONSTRAINT "ui_popups_ui_component_id_ui_components_id_fk" FOREIGN KEY ("ui_component_id") REFERENCES "public"."ui_components"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_ui_popups_ui_component_id" ON "ui_popups" USING btree ("ui_component_id");