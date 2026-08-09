import { PrismaClient } from "@prisma/client";
import { categories } from "./seed-data/categories";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  for (const category of categories) {
    const parent = await prisma.category.upsert({
      where: {
        slug: category.slug,
      },
      update: {
        name: category.name,
        icon: category.icon,
        sortOrder: category.sortOrder,
        isActive: true,
      },
      create: {
        name: category.name,
        slug: category.slug,
        icon: category.icon,
        sortOrder: category.sortOrder,
        isActive: true,
      },
    });

    if (category.children) {
      for (const child of category.children) {
        await prisma.category.upsert({
          where: {
            slug: child.slug,
          },
          update: {
            name: child.name,
            icon: child.icon,
            sortOrder: child.sortOrder,
            parentId: parent.id,
            isActive: true,
          },
          create: {
            name: child.name,
            slug: child.slug,
            icon: child.icon,
            sortOrder: child.sortOrder,
            parentId: parent.id,
            isActive: true,
          },
        });
      }
    }
  }

  console.log("✅ Database seed completed.");
}

main()
  .catch((error) => {
    console.error("❌ Database seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
