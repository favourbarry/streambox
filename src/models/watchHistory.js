import { Model } from '../db/objection.js';

class WatchHistory extends Model {
    static get tableName() {
        return 'watch_history';
    }
    
    static get idColumn() {
        return 'id';
    }
}

export { WatchHistory };
export default WatchHistory;