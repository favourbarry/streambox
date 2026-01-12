import { Model } from '../db/objection.js';

export class Livestream extends Model {
    static get tableName() {
        return 'livestreams';
    }
    static get idColumn(){
        return 'id';
    }
    static get relationsMappings(){
        const {LivestreamViewer} = require("./LivestreamViewer.js");
        return {
            viewers: {
                relation: Model.HasManyRelation,
                modelClass: LivestreamViewer,
                join: {
                    from: "livestreams.id",
                    to: "livestream_viewers.livestream_id"
                }
            }
        };
    }
}


export default Livestream;