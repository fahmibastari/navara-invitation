-- CreateTable
CREATE TABLE "Music" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Music_pkey" PRIMARY KEY ("id")
);
