import { Model } from "objection";

export class LivestreamViewer extends Model {
    static get tableName(){
        return "livestream_viewers";
    }
}