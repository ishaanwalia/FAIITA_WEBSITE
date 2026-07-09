-- AlterTable
ALTER TABLE "Leader" ADD COLUMN     "focusAreas" TEXT;

-- AlterTable
ALTER TABLE "MemberAssociation" ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "presidentName" TEXT;

-- AlterTable
ALTER TABLE "Policy" ADD COLUMN     "fileSize" TEXT;
