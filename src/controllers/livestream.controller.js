const db = require("knex")(require("../../knexfile").development);
const crypto = require("crypto");

//create livestream
exports.createLivestream = async (req, res) => {
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
        res.status(201).json(livestream);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};
//start livestream
exports.startLivestream = async (req, res) => {
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

        res.json({message: "livestream started"});
    } catch (error){
        res.status(500).json({error: error.message});
    }
};
//get livestreams
exports.getLivestreams = async (req, res) => {
    try{
        const livestreams = await db("livestreams").select("*");
        res.json(livestreams);
    } catch (error){
        res.status(500).json({error: error.message});
    }
};
//Join livestream
exports.joinlivestream = async (req, res) => {
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
        
        res.json({message: "Joined livestream successfully", livestream});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

//end livestream
exports.endlivestream = async (req, res) =>{
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
        res.json({message: "livestream ended"});
    } catch (error){
        res.status(500).json({error: error.message});
    }
};
