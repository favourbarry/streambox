const { Livestream } = require("../models/livestream");
const { Like } = require("../models/like");
const { Comment } = require("../models/comment");
const { WatchHistory } = require("../models/watchHistory");

//like / unlike video
exports.toogleLike = async (req, res) => {
    try{
        const {videoId} = req.params; 
        const existing = await Like.query()
        .where({ user_id: req.user.id, video_id: videoId})
        .first();

        if(existing){
            await Like.query().where({ user_id: req.user.id, video_id: videoId }).delete();
            return res.json({message: "video unliked"});
        }
            await Like.query().insert({ user_id: req.user.id, video_id: videoId});
            return res.json({message: "video liked"});

    }   catch (err){
        console.error(err);
        res.status(500).json({message: "server error"});
    }
};
//add comment


// GET COMMENTS
exports.getComments = async (req, res) => {
    try{
        const { videoId } = req.params; 
        const comments = await knex("comments")
        .join("users", "comments.user_id", "users.id")
        .select("comments.id", "comments.text", "comments.created_at", "users.username")
        .where("comments.video_id", videoId)
        .orderBy("comments.created_at", "desc");
        res.json(comments);
    } catch (err){
        console.error(err);
        res.status(500).json({message: "server error"});
    }
};
//comment on video
exports.addComment = async (req, res) => {
    try{
        const {videoId} = req.params;
        const {text} = req.body;

        const [comment] = await knex("comments")
        .insert({user_id: req.user.id,
            video_id: videoId,
            comment_text: text,
        })
        .returning("*");
        res.status(201).json({comment});

    } catch(err){
        console.error(err);
        res.status(500).json({message: "Server error"});
    }
};

//watch history
exports.addWatchHistory = async (req, res) => {
    try{
        const {videoId} = req.params;

        await knex("watch_history").insert({
            user_id: req.user.id,
            video_id: videoId,
        });
        res.json({message: "Watch history updated"});

    } catch (err) {
        res.status(500).json({message: "server error"});
    }
};
