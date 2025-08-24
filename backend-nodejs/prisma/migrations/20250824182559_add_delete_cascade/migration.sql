-- DropForeignKey
ALTER TABLE "public"."cars" DROP CONSTRAINT "cars_model_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."models" DROP CONSTRAINT "models_brand_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."models" ADD CONSTRAINT "models_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cars" ADD CONSTRAINT "cars_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE CASCADE ON UPDATE CASCADE;
