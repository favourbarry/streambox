const { Model } = require('objection');

class Like extends Model {
    static get tableName() {
        return 'likes';
    }
    
    static get idColumn() {
        return 'id';
    }
}

module.exports = { Like };