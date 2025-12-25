const { Model } = require('objection');

class Comment extends Model {
    static get tableName() {
        return 'comments';
    }
    
    static get idColumn() {
        return 'id';
    }
}

module.exports = { Comment };