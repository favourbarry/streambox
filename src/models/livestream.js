import { Model } from 'objection';

export class Livestream extends Model {
    static get tableName() {
        return 'livestreams';
    }
    static get idColumn(){
        return 'id';
    }
    static get relationsMappings(){
        const {LivestreamViewer} = require("./LivestreamViewer");
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
