import knex from "knex";
import { env } from "~/env.mjs";

export const knexService = knex({
  client: env.DB_CLIENT,
  connection: {
    database: env.DB_NAME,
    host: env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
  },
});
