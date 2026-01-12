import { Model } from '../db/objection.js';

class Comment extends Model {
    static get tableName() {
        return 'comments';
    }
    
    static get idColumn() {
        return 'id';
    }
}

export { Comment };
export default Comment;