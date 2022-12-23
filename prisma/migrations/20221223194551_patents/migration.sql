-- CreateTable
CREATE TABLE "patents" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "patents_pkey" PRIMARY KEY ("id")
);
