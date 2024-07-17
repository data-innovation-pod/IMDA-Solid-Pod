/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("audit", function (table) {
    table.increments("id");
    table.string("action_type");
    table.string("actioner");
    table.string("actionee");
    table.string("resource_url");
    table.string("old_value");
    table.string("new_value");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("audit");
}
