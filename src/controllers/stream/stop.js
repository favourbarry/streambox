import knex from "knex";

export const stopStream = async (req, res) => {
    const {name: streamKey} = req.body;

    await knex("livestream")
    .where({stream_key: streamKey})
    .update({
        is_live: false,
        ended_at: Date.now()
    });
    res.status(200).json({message: "stream stopped successfully"});
};