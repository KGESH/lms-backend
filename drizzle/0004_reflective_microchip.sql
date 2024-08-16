ALTER TABLE "course_product_snapshot_contents" RENAME COLUMN "course_product_snapshot_id" TO "product_snapshot_id";--> statement-breakpoint
ALTER TABLE "course_product_snapshot_discounts" RENAME COLUMN "course_product_snapshot_id" TO "product_snapshot_id";--> statement-breakpoint
ALTER TABLE "course_product_snapshot_pricing" RENAME COLUMN "course_product_snapshot_id" TO "product_snapshot_id";--> statement-breakpoint
ALTER TABLE "course_product_snapshots" RENAME COLUMN "course_product_id" TO "product_id";