import { Model } from '../db/objection.js';

class Like extends Model {
    static get tableName() {
        return 'likes';
    }
    
    static get idColumn() {
        return 'id';
    }
}

export { Like };
export default Like;