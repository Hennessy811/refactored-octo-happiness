var express = require("express");
var router = express.Router();

let sampleRes = {
    last_hit: {
        time: new Date().getTime(),
        x: 100,
        y: 120,
        strength: 0.4,
        id: 21341
    },
    last_pose: {
        time_start: new Date().getTime() - 10000,
        time_end: new Date().getTime() - 5000,
        pose_id: 1
    }
};

router.post("/pose", (req, res, next) => {
    const { last_pose } = req.body;

    sampleRes.last_pose.pose_id = last_pose.pose_id;
    sampleRes.last_pose.time_start = last_pose.time_start || sampleRes.last_pose.time_start;
    sampleRes.last_pose.time_end = last_pose.time_end || sampleRes.last_pose.time_end;

    res.json(sampleRes);
});

router.get("/hit/:x/:y/:time/:strength", (req, res, next) => {
    sampleRes.last_hit = {
        x: req.params.x,
        y: req.params.y,
        time: req.params.time,
        strength: req.params.strength
    };

    res.json(sampleRes);
});

router.delete("/", (req, res) => {
    sampleRes = null;
});

/* GET home page. */
router.get("/", function(req, res, next) {
    res.json(sampleRes);
});

module.exports = router;
