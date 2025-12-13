const knex = require("knex")(require("../../knexfile").development);
const fs = require("fs");
const path = require("path");
exports.uploadVideo = async (req, res) => {
    try{
        const {title, description } = req.body;
        if(!req.file){
            return res.status(400).json({message: "No video file uploaded"});

        }
        const videoPath = req.file.path;
        const [Video] = await knex ("videos")
        .insert({
            title,
            description,
            video_url: videoPath,
            user_id: req.user.id,
        })
        .returning("*")

        res.status(201).json({
        message: "Video uploaded successfully",
        Video,
    });
} catch (error) {
    res.status(500).json({message: "Server error", error: error.message});
}
};

exports.getAllvideos = async(req, res) => {
    try{
        const videos = await knex("videos")
        .join("users", "videos.user_id", "users.id")
        .select("videos.*",
            "user.name as uploader"
        )
        .orderBy("videos.created_at", "desc");
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({message: "Server error"});
    }
};

exports.getSingleVideo = async (req, res) => {
    try{
        const video = await knex("videos")
        .join("users", "videos.user_id", "users.id")
        .select("videos.*", "users.name as user_name")
        .where("videos.id", req.params.id).first();
        if (!video) {
            return res.status(404).json({message: "video not found"});
        }
        res.json(video);
    } catch (error){
        return res.status(500).json({message: "Internal server error"});
    }
};
exports.deleteVideo = async (req, res) => {
    try{
        const { id } = req.params;

        const video = await knex("videos").where({ id }).first();
        if(!video){
            return res.status(404).json({message: "video not found"});
        }
        if(video.user_id !== req.user.id){
            return res.status(403).json({message: "user not found"});
        }
        await knex("videos").where({id}).del();

        res.json({message: "video deleted successfully"});
    } catch (error) {
        res.status(500).json({message: "server error"});
    }
};
exports.streamVideo = async (req, res) => {
    try{
        const { id } = req.params;

        //get video from db
        const video = await knex("videos").where({id}).first();
        if(!video){
            return res.status(404).json({message: "video not found"});
        }

        const videoPath = path.join(__dirname, "..", "..", video.video_url);
        //check file exists
        if(!fs.existsSync(videoPath)){
            return res.status(404).json({message: "video file missing"});
        }
        const stat = fs.statSync(videoPath);
        const filesize = stat.size;
        const range = req.headers.range;

        if(!range){
            return res.status(416).json({message: "Range header required"});
        }
        const CHUNK_SIZE = 10 ** 6;
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, filesize - 1);

        const contentLength = end - start + 1;

        res.writeHead(206, {
            "Content-Range": `bytes ${start}-${end}/${filesize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4",
        });

        const videoStream = fs.createReadStream(videoPath, {start, end });
        videoStream.pipe(res);


    } catch (error){
        console.error(error);
        res.status(500).json({message: "streaming error", error: error.message});
    }
};