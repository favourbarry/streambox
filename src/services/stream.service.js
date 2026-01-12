import crypto from "crypto";
import db from "../db/knex.js";
import { timeStamp } from "console";
// Stream service implementation 
const STREAM_STATUS = {
    created: 'created',
    live: 'live',
    ended: 'ended'
};
/**
 * create a new livestream
 * @param {{ownerId: number, title: string, description?: string}} param0 
 * @returns {promise<object>} the created stream object
 */

export async function createstream({ownerId, title, description = ""}){
    if(!ownerId || !title) {
        throw new Error ("owner and title are required");

    }
  
    /**
     * Inserts a new livestream record into the database
     * @param {string} title - The title of the livestream
     * @param {string} description - The description of the livestream
     * @param {string} stream_key - The unique stream key for the livestream
     * @param {number} ownerId - The ID of the user creating the livestream
     * @returns {Promise<Object>} The created livestream object with all fields including id and timestamps
     */
    const stream_key = crypto.randomBytes(16).toString("hex");
    //insert into db
    const [livestream] = await db("livestreams")
    .insert({
        title, 
        description,
        stream_key,
        created_by: ownerId,
        is_live: false, 
    })
    .returning("*");
    //log audit
    await db("audit_logs").insert({
        entity_type: 'stream',
        action: "created",
        user_id: ownerId,
        created_at: db.fn.now(),
    });
    return livestream;
}
/**
 * Start a livestream (only the owner can start)
 * @param {{streamId: number, userId: number}} param0
 * @returns {promise<object>} the updated livestream record
 */
export async function startstream({ streamId, userId }){
    //ensure the stream exists and user is the creator
    const stream = await db("livestreams")
    .where({ id: streamId, created_by: userId, is_live: false})
    .first();
    if(!stream) {
        throw new Error("stream not found or permission denied");
    }
    await db("livestreams")
    .where({ id: streamId})
    .update({ is_live: true, started_at: db.fn.now()});
    
    await db("audit_logs").insert({
        livestream_id: streamId,
        user_id: userId,
        entity_type: "stream",
        action: "started",
        created_at: db.fn.now(),
    });
    return getStreamById(streamId);
}
/**
 * End a livestream (only the owner can end)
 * @param {{ streamId: number, userId: number }} param0
 * @returns {Promise<object>} the updated livestream record
 */
export async function endStream({ streamId, userId }){
    const stream = await db("livestream")
    .where({ id: streamId, created_by: userId})
    .update({ is_live: false, ended_at: db.fn.now() });
    if(!stream){
        throw new Error("stream not found or permission denied");
    }
    await db("livestreams")
    .where({ id: streamId })
    .update({ is_live: false, ended_at: db.fn.now() });

    await db("livestream_events").insert({
        livestream_id: streamId,
        user_id: userId,
        entity_type: "stream",
        action: "ended",
        created_at: db.fn.now(),
    });
    await db("audit_logs").insert({
        entity_type: "stream",
        action: "ended",
        user_id: userId,
        created_at: db.fn.now(),
    });
    return getStreamById(streamId);
}
/**
 * Get a livestream by Id.
 */
export async function getStreamById(streamId) {
    return await db("livestreams").where({ id: streamId }).first();
}

export default {
    createstream,
    startstream,
    endStream,
    getStreamById,
};