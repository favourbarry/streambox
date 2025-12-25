/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("livestream_viewers", (table) => {
    table.increments("id").primary();
    table
        .integer("livestream_id")
        .references("id")
        .inTable("livestreams")
        .onDelete("CASCADE")
        .notNullable();
        table
        .integer("viewer_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
        table.timestamp("joined_at").defaultTo(knex.fn.now());
        table.timestamp("left_at");
        table.integer("watch_duration");
        table.unique(["livestream_id", "viewer_id"]);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists("livestream_viewers");
};
