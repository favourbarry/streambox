import { Model } from "objection"; 
export class LivestreamMessage extends Model {
    static get tableName() {
        return "livestream_messages";
    }
}