-- AlterTable
ALTER TABLE "MealPlan" ADD COLUMN "reviewerId" TEXT;
ALTER TABLE "MealPlan" ADD COLUMN "comments" JSONB;

-- AddForeignKey
ALTER TABLE "MealPlan" ADD CONSTRAINT "MealPlan_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
