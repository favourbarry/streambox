import { Model } from 'objection';
import knex from './knex.js';

// Initialize Objection.js with Knex instance
Model.knex(knex);

// Export both Model and knex for use in other files
export { Model, knex };