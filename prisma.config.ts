import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    seed: "npm run db:sync-content",
  },

  datasource: {
    url: env("DATABASE_URL"),
  },
});
