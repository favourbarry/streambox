import knex from "knex";
import knexConfig from "../../knexfile.js";
import crypto from "crypto";

const db = knex(knexConfig.development);

//generate stream key
export const createLivestream = async (req, res) => {
    try {
        const streamkey = crypto.randomBytes(16).toString("hex");
        const [livestream] = await db("livestreams").insert({
            title: req.body.title,
            description: req.body.description,
            stream_key: streamkey,
            created_by: req.user.id,
            is_live: false,
        }).returning("*");
        res.status(201).json({livestream});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};
   
// Validate stream key (for OBS/streaming software)
export const validateStreamKey = async (req, res) => {
    try {
        if (!req.body || !req.body.stream_key) {
            return res.status(400).json({ message: "Stream key is required" });
        }
        
        const { stream_key } = req.body;
        
        const livestream = await db("livestreams")
            .where({ stream_key, is_live: true })
            .first();
            
        if (!livestream) {
            return res.status(401).json({ message: "Invalid stream key or stream not live" });
        }
        
        res.json({ 
            message: "Stream key valid",
            livestream_id: livestream.id,
            title: livestream.title 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get stream key for streamer (to use in OBS)
export const getStreamKey = async (req, res) => {
    try {
        const { id } = req.params;
        
        const livestream = await db("livestreams")
            .where({ id, created_by: req.user.id })
            .first();
            
        if (!livestream) {
            return res.status(404).json({ message: "Livestream not found" });
        }
        
        res.json({
            stream_key: livestream.stream_key,
            stream_url: `http://localhost:4000/stream/live/${livestream.stream_key}`,
            instructions: "Stream key for testing - RTMP server not implemented yet"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default { createLivestream, validateStreamKey, getStreamKey };