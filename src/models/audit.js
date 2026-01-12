const { Model } = require('objection');

class AuditLog extends Model {
  static get tableName() {
    return 'audit_logs';
  }

  static get idColumn() {
    return 'id';
  }
}

module.exports = { AuditLog };