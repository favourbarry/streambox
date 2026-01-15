/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("livestream_viewers", (table) => {
    table.increments("id").primary();
    table.integer("livestream_id").references("id").inTable("livestreams").onDelete("CASCADE");
    table.integer("user_id").references("id").inTable("users").onDelete("CASCADE");
    table.timestamp("joined_at").defaultTo(knex.fn.now());
    table.unique(["livestream_id", "user_id"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
