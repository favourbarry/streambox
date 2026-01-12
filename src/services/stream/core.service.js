import db from "../db/knex.js";
import crypto from "crypto";

export async function createstream({ onwerId, title, description = ""}) {
    if(!onwerId || !title) throw new Error("onwer and title are required");

    const stream_key = crypto.randomBytes(16).toString("hex");
    const livestream = await db("livestream")
    .insert({
        title,
        description,
        stream_key,
        created_by: onwerId,
        is_live: false,
    })
    .returning("*");

    await db("audit_logs").insert({
        entity_type: "stream",
        action: "created",
        user_id: onwerId,
        created_at: db.fn.now(),
    });
    return livestream;
}
    export async function startstream({ streamId, user_id }) {
        const stream = await db("livestream")
        .where({ id: streamId, created_by: user_id, is_live: false})
        .first();
        if (!stream) throw new Error ("stream not found or permission denied");

        await db("livestream")
        .where({ id: streamId })
        .update({ is_live: true, started_at: db.fn.now()});

        await db("livestream_events").insert({
            livestream_id: streamId,
            user_id,
            event_type: "stream_started",
        });
        await db("audit_logs").insert({
            entity_type: "stream",
            action: "started",
            user_id,
            created_at: db.fn.now(),
        });
        return getStreamById(streamId);
    }
    export async function endStream({ streamId, user_id}){
        const stream = await db("livestream")
        .where({ id: streamId, created_by: user_id, is_live: true})
        .first();
        if (!stream) throw new Error ("stream not found or permission denied");

        await db("livestream")
        .where({ id: streamId })
        .update({ is_live: false, ended_at: db.fn.now() });

        await db("livestream_events").insert({
            livestream_id: streamId,
            user_id,
            event_type: "stream_ended",
            
        });
        return async function getStreamById(streamId){
            return db("livestream")
            .where({ id: streamId })
            .update({ is_live: false, ended_at: db.fn.now() });
        }
    }
    