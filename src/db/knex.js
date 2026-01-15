import knex from "knex";
import knexConfig from "../../knexfile.js";
// Initialize Knex with development configuration
const db = knex(knexConfig.development);

export default db;
