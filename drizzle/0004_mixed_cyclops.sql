ALTER TABLE "coupon_disposables" DROP CONSTRAINT "coupon_disposables_code_unique";--> statement-breakpoint
ALTER TABLE "coupon_ticket_payments" DROP CONSTRAINT "coupon_ticket_payments_coupon_ticket_id_unique";--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_tx_id_unique";--> statement-breakpoint
ALTER TABLE "orders" DROP CONSTRAINT "orders_payment_id_unique";--> statement-breakpoint
ALTER TABLE "teachers" DROP CONSTRAINT "teachers_user_id_unique";--> statement-breakpoint
ALTER TABLE "ui_components" DROP CONSTRAINT "ui_components_name_unique";--> statement-breakpoint
ALTER TABLE "user_infos" DROP CONSTRAINT "user_infos_user_id_unique";--> statement-breakpoint
ALTER TABLE "user_infos" DROP CONSTRAINT "user_infos_phone_number_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_email_unique";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_coupon_all_criteria_coupon_id" ON "coupon_all_criteria" USING btree ("coupon_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_coupon_category_criteria_coupon_id" ON "coupon_category_criteria" USING btree ("coupon_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_coupon_course_criteria_coupon_id" ON "coupon_course_criteria" USING btree ("coupon_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_coupon_disposables_coupon_id" ON "coupon_disposables" USING btree ("coupon_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_coupon_disposables_code" ON "coupon_disposables" USING btree ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_coupon_disposables_expired_at" ON "coupon_disposables" USING btree ("expired_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_coupon_ebook_criteria_coupon_id" ON "coupon_ebook_criteria" USING btree ("coupon_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_coupon_teacher_criteria_coupon_id" ON "coupon_teacher_criteria" USING btree ("coupon_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_coupon_ticket_payments_coupon_ticket_id" ON "coupon_ticket_payments" USING btree ("coupon_ticket_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_coupon_ticket_payments_order_id" ON "coupon_ticket_payments" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_coupon_tickets_coupon_id" ON "coupon_tickets" USING btree ("coupon_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_coupon_tickets_user_id" ON "coupon_tickets" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_coupon_tickets_expired_at" ON "coupon_tickets" USING btree ("expired_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_coupons_expired_at" ON "coupons" USING btree ("expired_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_chapters_course_id" ON "chapters" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_course_categories_parent_id" ON "course_categories" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_course_certificates_enrollment_id" ON "course_certificates" USING btree ("enrollment_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_course_enrollment_progresses_enrollment_lesson" ON "course_enrollment_progresses" USING btree ("enrollment_id","lesson_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_course_enrollments_user_id" ON "course_enrollments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_course_enrollments_course_id" ON "course_enrollments" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_course_product_snapshot_announcements_product_snapshot_id" ON "course_product_snapshot_announcements" USING btree ("product_snapshot_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_course_product_snapshot_contents_product_snapshot_id" ON "course_product_snapshot_contents" USING btree ("product_snapshot_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_course_product_snapshot_discounts_product_snapshot_id" ON "course_product_snapshot_discounts" USING btree ("product_snapshot_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_course_product_snapshot_pricing_product_snapshot_id" ON "course_product_snapshot_pricing" USING btree ("product_snapshot_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_course_product_snapshot_refund_policies_product_snapshot_id" ON "course_product_snapshot_refund_policies" USING btree ("product_snapshot_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_course_product_snapshot_ui_contents_product_snapshot_id" ON "course_product_snapshot_ui_contents" USING btree ("product_snapshot_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_course_product_snapshots_product_id" ON "course_product_snapshots" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_course_product_snapshots_thumbnail_id" ON "course_product_snapshots" USING btree ("thumbnail_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_course_product_snapshots_created_at" ON "course_product_snapshots" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_course_products_course_id" ON "course_products" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_courses_teacher_id" ON "courses" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_courses_category_id" ON "courses" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_lesson_contents_lesson_id" ON "lesson_contents" USING btree ("lesson_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_lessons_chapter_id" ON "lessons" USING btree ("chapter_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ebook_categories_parent_id" ON "ebook_categories" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ebook_contents_ebook_id" ON "ebook_contents" USING btree ("ebook_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ebook_enrollments_user_id" ON "ebook_enrollments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ebook_enrollments_ebook_id" ON "ebook_enrollments" USING btree ("ebook_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ebook_product_snapshot_announcements_product_snapshot_id" ON "ebook_product_snapshot_announcements" USING btree ("product_snapshot_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ebook_product_snapshot_contents_product_snapshot_id" ON "ebook_product_snapshot_contents" USING btree ("product_snapshot_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ebook_product_snapshot_discounts_product_snapshot_id" ON "ebook_product_snapshot_discounts" USING btree ("product_snapshot_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ebook_product_snapshot_pricing_product_snapshot_id" ON "ebook_product_snapshot_pricing" USING btree ("product_snapshot_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ebook_product_snapshot_refund_policies_product_snapshot_id" ON "ebook_product_snapshot_refund_policies" USING btree ("product_snapshot_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ebook_product_snapshot_ui_contents_product_snapshot_id" ON "ebook_product_snapshot_ui_contents" USING btree ("product_snapshot_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ebook_product_snapshots_product_id" ON "ebook_product_snapshots" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ebook_product_snapshots_thumbnail_id" ON "ebook_product_snapshots" USING btree ("thumbnail_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ebook_product_snapshots_created_at" ON "ebook_product_snapshots" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ebook_products_ebook_id" ON "ebook_products" USING btree ("ebook_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ebooks_teacher_id" ON "ebooks" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ebooks_category_id" ON "ebooks" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_course_orders_order_id" ON "course_orders" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_course_orders_product_snapshot_id" ON "course_orders" USING btree ("product_snapshot_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ebook_orders_order_id" ON "ebook_orders" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ebook_orders_product_snapshot_id" ON "ebook_orders" USING btree ("product_snapshot_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_orders_user_id" ON "orders" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_orders_tx_id" ON "orders" USING btree ("tx_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_orders_payment_id" ON "orders" USING btree ("payment_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_orders_paid_at" ON "orders" USING btree ("paid_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_otps_created_at" ON "otps" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_post_categories_parent_id" ON "post_categories" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_post_category_read_accesses_category_id" ON "post_category_read_accesses" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_post_category_write_accesses_category_id" ON "post_category_write_accesses" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_post_comment_likes_comment_id" ON "post_comment_likes" USING btree ("comment_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_post_comment_likes_user_id" ON "post_comment_likes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_post_comment_likes_created_at" ON "post_comment_likes" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_post_comment_snapshots_comment_id" ON "post_comment_snapshots" USING btree ("comment_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_post_comment_snapshots_created_at" ON "post_comment_snapshots" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_post_comments_post_id" ON "post_comments" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_post_comments_user_id" ON "post_comments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_post_comments_parent_id" ON "post_comments" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_post_comments_created_at" ON "post_comments" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_post_likes_post_id" ON "post_likes" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_post_likes_user_id" ON "post_likes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_post_likes_created_at" ON "post_likes" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_post_snapshots_post_id" ON "post_snapshots" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_post_snapshots_created_at" ON "post_snapshots" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_posts_user_id" ON "posts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_posts_category_id" ON "posts" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_posts_created_at" ON "posts" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_promotion_contents_promotion_id" ON "promotion_contents" USING btree ("promotion_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_promotions_coupon_id" ON "promotions" USING btree ("coupon_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_promotions_opened_at" ON "promotions" USING btree ("opened_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_promotions_closed_at" ON "promotions" USING btree ("closed_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_promotions_created_at" ON "promotions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_course_reviews_review_id" ON "course_reviews" USING btree ("review_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_course_reviews_course_id" ON "course_reviews" USING btree ("course_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_course_reviews_created_at" ON "course_reviews" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_course_reviews_deleted_at" ON "course_reviews" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ebook_reviews_review_id" ON "ebook_reviews" USING btree ("review_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ebook_reviews_ebook_id" ON "ebook_reviews" USING btree ("ebook_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ebook_reviews_created_at" ON "ebook_reviews" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ebook_reviews_deleted_at" ON "ebook_reviews" USING btree ("deleted_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_review_replies_review_id" ON "review_replies" USING btree ("review_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_review_replies_user_id" ON "review_replies" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_review_replies_created_at" ON "review_replies" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_review_reply_snapshots_review_reply_id" ON "review_reply_snapshots" USING btree ("review_reply_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_review_reply_snapshots_created_at" ON "review_reply_snapshots" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_review_snapshots_review_id" ON "review_snapshots" USING btree ("review_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_review_snapshots_created_at" ON "review_snapshots" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_reviews_order_id" ON "reviews" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_reviews_user_id" ON "reviews" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_reviews_created_at" ON "reviews" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_reviews_deleted_at" ON "reviews" USING btree ("deleted_at");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_teachers_user_id" ON "teachers" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_signup_terms_term_id" ON "signup_terms" USING btree ("term_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_term_snapshots_term_id" ON "term_snapshots" USING btree ("term_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_term_snapshots_created_at" ON "term_snapshots" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_user_terms_user_id" ON "user_terms" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_user_terms_term_id" ON "user_terms" USING btree ("term_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_ui_banners_ui_component_id" ON "ui_banners" USING btree ("ui_component_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ui_carousel_contents_ui_carousel_id" ON "ui_carousel_contents" USING btree ("ui_carousel_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ui_carousel_reviews_ui_carousel_id" ON "ui_carousel_reviews" USING btree ("ui_carousel_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_ui_carousels_ui_component_id" ON "ui_carousels" USING btree ("ui_component_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_ui_components_name" ON "ui_components" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_ui_components_path" ON "ui_components" USING btree ("path");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_ui_marketing_banners_ui_component_id" ON "ui_marketing_banners" USING btree ("ui_component_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_ui_repeat_timers_ui_component_id" ON "ui_repeat_timers" USING btree ("ui_component_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_user_accounts_user_id" ON "user_accounts" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_user_infos_user_id" ON "user_infos" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_user_infos_phone_number" ON "user_infos" USING btree ("phone_number");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_user_sessions_user_id" ON "user_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_users_email" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_users_role" ON "users" USING btree ("role");--> statement-breakpoint
ALTER TABLE "otps" ADD CONSTRAINT "otps_identifier_usage_unique" UNIQUE("identifier","usage");