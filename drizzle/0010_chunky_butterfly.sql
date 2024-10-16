ALTER TABLE "ui_popups" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "ui_popups" ADD COLUMN "metadata" text;--> statement-breakpoint
ALTER TABLE "ui_popups" ADD COLUMN "json" json NOT NULL;--> statement-breakpoint
ALTER TABLE "ui_popups" DROP COLUMN IF EXISTS "rich_text_content";--> statement-breakpoint
ALTER TABLE "ui_popups" DROP COLUMN IF EXISTS "button_label";--> statement-breakpoint
ALTER TABLE "ui_popups" DROP COLUMN IF EXISTS "link_url";