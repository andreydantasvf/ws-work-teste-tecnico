-- CreateTable
CREATE TABLE "public"."brands" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."models" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "fipe_value" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "brand_id" INTEGER NOT NULL,

    CONSTRAINT "models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cars" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "fuel" TEXT NOT NULL,
    "number_of_ports" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "model_id" INTEGER NOT NULL,

    CONSTRAINT "cars_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "brands_name_key" ON "public"."brands"("name");

-- CreateIndex
CREATE UNIQUE INDEX "models_name_key" ON "public"."models"("name");

-- AddForeignKey
ALTER TABLE "public"."models" ADD CONSTRAINT "models_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cars" ADD CONSTRAINT "cars_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "public"."models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
