/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("livestream_messages", (table) => {
    table.increments("id").primary();
    table.integer("livestream_id").references("id").inTable("livestreams").onDelete("CASCADE");
    table.integer("user_id").references("id").inTable("users").onDelete("SET NULL");
    table.text("message").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("livestream_messages");
};
