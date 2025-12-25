const express = require('express');
const cors = require('cors');
const path = require('path');
const videoRoutes = require("./src/routes/video.routes");
const engagementRoutes = require("./src/routes/engagement.routes");
const livestreamRoutes = require("./src/routes/livestream.routes");
const streamRoutes = require("./src/routes/stream.routes");
const rtmpServer = require('./src/config/rtmp');

const authRoutes = require('./src/routes/auth.Routes');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/uploads', express.static(path.join(__dirname, "..", "uploads")));
app.use('/engagement', engagementRoutes);
app.use('/videos', videoRoutes);
app.use('/livestreams', livestreamRoutes);
app.use('/stream', streamRoutes);

app.get('/', (req, res) => {
    res.json({ message: "streambox api is running" });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Start RTMP server
rtmpServer.run();
console.log('RTMP Server running on port 1935');