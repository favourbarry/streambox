const express = require("express");
const router = express.Router();
const controller = require("../controllers/internalStream.controller");


router.post("/start", controller.startInternalStream);
router.post("/end", controller.endInternalStream);
module.exports = router;
