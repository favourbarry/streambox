import { Livestream } from "../models/livestream.js";
import { Like } from "../models/like.js";
import { Comment } from "../models/comment.js";
import { WatchHistory } from "../models/watchHistory.js";
import knex from "knex";
import knexConfig from "../../knexfile.js";

const db = knex(knexConfig.development);

//like / unlike video
export const toogleLike = async (req, res) => {
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
        res.status(500).json({message: "server error", error: err.message});
    }
};
//add comment


// GET COMMENTS
export const getComments = async (req, res) => {
    try{
        const { videoId } = req.params; 
        const comments = await db("comments")
        .join("users", "comments.user_id", "users.id")
        .select("comments.id", "comments.text", "comments.created_at", "users.username")
        .where("comments.video_id", videoId)
        .orderBy("comments.created_at", "desc");
        res.json(comments);
    } catch (err){
        console.error(err);
        res.status(500).json({message: "server error", error: err.message});
    }
};
//comment on video
export const addComment = async (req, res) => {
    try{
        const {videoId} = req.params;
        const {text} = req.body;

        const [comment] = await db("comments")
        .insert({user_id: req.user.id,
            video_id: videoId,
            comment_text: text,
        })
        .returning("*");
        res.status(201).json({comment});

    } catch(err){
        console.error(err);
        res.status(500).json({message: "Server error", error: err.message});
    }
};

//watch history
export const addWatchHistory = async (req, res) => {
    try{
        const {videoId} = req.params;

        await db("watch_history").insert({
            user_id: req.user.id,
            video_id: videoId,
        });
        res.json({message: "Watch history updated"});

    } catch (err) {
        console.error(err);
        res.status(500).json({message: "server error", error: err.message});
    }
};

export default { toogleLike, getComments, addComment, addWatchHistory };
