import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { trainingCityCurriculum } from "../prisma/training-city-curriculum";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  let courseCount = 0;
  let moduleCount = 0;
  let lessonCount = 0;

  for (const district of trainingCityCurriculum) {
    const role = await prisma.role.findUnique({
      where: {
        slug: district.roleSlug,
      },
      select: {
        id: true,
      },
    });

    if (!role) {
      throw new Error(
        `Role ${district.roleSlug} is missing. Run the main Prisma seed first.`,
      );
    }

    const course = await prisma.course.upsert({
      where: {
        slug: district.course.slug,
      },
      create: {
        ...district.course,
        roleId: role.id,
        isPublished: true,
      },
      update: {
        ...district.course,
        roleId: role.id,
        isPublished: true,
      },
    });

    courseCount += 1;

    for (const curriculumModule of district.modules) {
      const moduleRecord = await prisma.module.upsert({
        where: {
          slug: curriculumModule.slug,
        },
        create: {
          title: curriculumModule.title,
          slug: curriculumModule.slug,
          description: curriculumModule.description,
          courseId: course.id,
          order: curriculumModule.order,
          isPublished: true,
        },
        update: {
          title: curriculumModule.title,
          description: curriculumModule.description,
          courseId: course.id,
          order: curriculumModule.order,
          isPublished: true,
        },
      });

      moduleCount += 1;

      for (const lesson of curriculumModule.lessons) {
        await prisma.lesson.upsert({
          where: {
            slug: lesson.slug,
          },
          create: {
            ...lesson,
            roleId: role.id,
            moduleId: moduleRecord.id,
          },
          update: {
            ...lesson,
            roleId: role.id,
            moduleId: moduleRecord.id,
          },
        });

        lessonCount += 1;
      }
    }
  }

  console.log(
    `Training City curriculum synchronized: ${courseCount} courses, ${moduleCount} modules, ${lessonCount} lessons.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
