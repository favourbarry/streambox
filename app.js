const express = require('express');
const cors = require('cors');
const path = require('path');
const videoRoutes = require("./src/routes/video.routes");
const engagementRoutes = require("./src/routes/engagement.routes");

const authRoutes = require('./src/routes/auth.Routes');
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/uploads', express.static(path.join(__dirname, "..", "uploads")));
app.use('/engagement', engagementRoutes);
app.use('/videos', videoRoutes);

app.get('/', (req, res) => {
    res.json({ message: "streambox api is running" });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});