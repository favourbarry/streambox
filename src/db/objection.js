const { Model } = require('objection');
const knex = require('./knex');

// Initialize Objection.js with Knex instance
Model.knex(knex);

// Export both Model and knex for use in other files
module.exports = {
  Model,
  knex
};