/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("user_connected_services", function (table) {
    table.increments("id");
    table.string("web_id").notNullable();
    table.string("service_name").notNullable();
    table.string("access_token", 1024);
    table.string("refresh_token", 1024);
    table.string("expires_at");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("user_connected_services");
}
