import express from 'express';
import cors from 'cors';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import './src/db/objection.js';

import videoRoutes from "./src/routes/video.routes.js";
import engagementRoutes from "./src/routes/engagement.routes.js";
import livestreamRoutes from "./src/routes/livestream.routes.js";
import streamRoutes from "./src/routes/stream.routes.js";
import rtmpServer from './src/config/rtmp.js';
import authRoutes from './src/routes/auth.Routes.js';

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 4000;

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/uploads', express.static(path.join(process.cwd(), "uploads")));
app.use('/engagement', engagementRoutes);
app.use('/videos', videoRoutes);
app.use('/livestreams', livestreamRoutes);
app.use('/stream', streamRoutes);

app.get('/', (req, res) => {
    res.json({ message: "streambox api is running" });
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Start RTMP server
rtmpServer.run();
console.log('RTMP Server running on port 1935');

export { app, io };