/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("livestream_comments", (table) => {
    table.increments("id").primary();
    table
        .integer("livestream_id")
        .references("id")
        .inTable("livestreams")
        .onDelete("CASCADE");
    table
        .integer("user_id")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
    table.text("comment").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());

  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("livestream_comments");
};
