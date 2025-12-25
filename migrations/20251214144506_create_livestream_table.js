/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("livestreams", (table) => {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.text("description").notNullable();
    table.string("stream_key").notNullable().unique();
    table.boolean("is_live").defaultTo(false);
    table.timestamp("started_at");
    table.timestamp("ended_at");
    table
        .integer("created_by")
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
        table.timestamp("created_at").defaultTo(knex.fn.now());
    

  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists("livestreams");
};
