/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("audit", function (table) {
    table.text("resource_url").alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("audit", function (table) {
    table.string("resource_url").alter();
  });
}
