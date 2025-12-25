const { Model } = require('objection');

class WatchHistory extends Model {
    static get tableName() {
        return 'watch_history';
    }
    
    static get idColumn() {
        return 'id';
    }
}

module.exports = { WatchHistory };