DO $$ BEGIN
 CREATE TYPE "public"."ui_carousel_type" AS ENUM('carousel.main-banner', 'carousel.review', 'carousel.product');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ui_carousel_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ui_carousel_id" uuid NOT NULL,
	"sequence" integer NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"rating" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ui_carousels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"ui_component_id" uuid NOT NULL,
	"carousel_type" "ui_carousel_type" NOT NULL,
	"title" text NOT NULL,
	"description" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ui_carousel_reviews" ADD CONSTRAINT "ui_carousel_reviews_ui_carousel_id_ui_carousels_id_fk" FOREIGN KEY ("ui_carousel_id") REFERENCES "public"."ui_carousels"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ui_carousels" ADD CONSTRAINT "ui_carousels_ui_component_id_ui_components_id_fk" FOREIGN KEY ("ui_component_id") REFERENCES "public"."ui_components"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
