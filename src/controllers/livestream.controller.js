import knex from "knex";
import knexConfig from "../../knexfile.js";
import crypto from "crypto";

const db = knex(knexConfig.development);

//create livestream
export const createLivestream = async (req, res) => {
    try{
        const {title, description} = req.body;
        const streamkey = crypto.randomBytes(16).toString("hex");

        const livestream = await db("livestreams").insert({
            title,
            description,
            stream_key: streamkey,
            created_by: req.user.id,
        })
        .returning("*");
          
        await db("audit_logs").insert({
            entity_type: 'stream',
            action: 'created',
            user_id: req.user.id,
            created_at: db.fn.now(),
        });

        res.status(201).json(livestream);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

//start livestream
export const startLivestream = async (req, res) => {
    try{
        const id = req.params.id;
        await db("livestreams")
        .where({id, created_by: req.user.id})
        .update({is_live: true, started_at: db.fn.now() });

        await db("livestream_events").insert({
            livestream_id: id,
            user_id: req.user.id,
            event_type: "stream_started",
        });

        await db("audit_logs").insert({
            entity_type: 'stream',
            action: 'started',
            user_id: req.user.id,
            created_at: db.fn.now(),
        });

        res.json({message: "livestream started"});
    } catch (error){
        res.status(500).json({error: error.message});
    }
};

//get livestreams
export const getLivestreams = async (req, res) => {
    try{
        const livestreams = await db("livestreams").select("*");
        res.json(livestreams);
    } catch (error){
        res.status(500).json({error: error.message});
    }
};

//Join livestream
export const joinlivestream = async (req, res) => {
    try {
        const {id} = req.params;
        const livestream = await db("livestreams")
        .where({id: id, is_live: true})
        .first();
        
        if(!livestream){
            return res.status(404).json({message: "livestream not found"});
        }
        
        await db("livestream_events").insert({
            livestream_id: id,
            user_id: req.user.id,
            event_type: "user_joined"
        });
        
        await db("audit_logs").insert({
            entity_type: 'stream',
            action: 'joined',
            user_id: req.user.id,
            created_at: db.fn.now(),
        });
        
        res.json({message: "Joined livestream successfully", livestream});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

//end livestream
export const endlivestream = async (req, res) =>{
    try{
        const {id} = req.params;

        await db("livestreams")
        .where({id, created_by: req.user.id})
        .update({is_live: false, ended_at: db.fn.now()});

        await db("livestream_events").insert({
            livestream_id: id,
            user_id: req.user.id,
            event_type: "stream_ended",
        });

        await db("audit_logs").insert({
            entity_type: 'stream',
            action: 'ended',
            user_id: req.user.id,
            created_at: db.fn.now(),
        });

        res.json({message: "livestream ended"});
    } catch (error){
        res.status(500).json({error: error.message});
    }
};

export default { createLivestream, startLivestream, getLivestreams, joinlivestream, endlivestream };
