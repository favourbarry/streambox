const db = require("knex")(require("../../knexfile").development);

exports.onStreamStart = async (req, res) => {
    const streamKey = req.body.name;

    const stream = await db("livestreams").where("stream_key", streamKey).first();
    if (!stream) {
        return res.status(403).send("Invalid stream key");
    }
    await db("livestreams").where({id: stream.id}).update({ is_active: true, updated_at: new Date() });
    res.status(200).send("stream started");
};

exports.onStreamEnd = async (req, res) => {
    const streamKey = req.body.name;

    const stream = await db("livestreams").where("stream_key", streamKey).first();
    if (!stream) {
        return res.status(403).send("Invalid stream key");
    }
    await db("livestreams").where({id: stream.id}).update({ is_active: false, updated_at: new Date() });
    res.status(200).send("stream ended");
};