var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

const statsSchema = new mongoose.Schema({
    stat_id: String,
    last_hit: {
        time: Number,
        x: Number,
        y: Number,
        strength: Number,
        id: Number
    },
    last_pose: {
        time_start: Number,
        time_end: Number,
        pose_id: Number
    }
});
var Stats = mongoose.model("Stats", statsSchema);

var mongoose = require("mongoose"); //process.env.MONGODB_URI
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
});

const STATS_ID = "arngry";

// const sampleRes = {
//     last_hit: {
//         time: new Date().getTime(),
//         x: 100,
//         y: 120,
//         strength: 0.4,
//         id: 21341
//     },
//     last_pose: {
//         time_start: new Date().getTime() - 10000,
//         time_end: new Date().getTime() - 5000,
//         pose_id: 1
//     }
// };

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
    // we're connected!
    console.log("db ready");
});

router.post("/pose", (req, res, next) => {
    Stats.findOne(
        {
            stat_id: STATS_ID
        },
        (err, item) => {
            if (!!item) {
                const { last_pose } = JSON.parse(req.body);

                const { time_start, time_end, pose_id } = last_pose;

                Stats.findOneAndUpdate(
                    {
                        stat_id: STATS_ID
                    },
                    {
                        last_pose: {
                            time_start,
                            time_end,
                            pose_id
                        }
                    },
                    (err, r) => {
                        if (!err) {
                            console.log(r, last_pose);
                            res.json({
                                stats: "updated"
                            });
                        } else {
                            console.log(err);
                            res.json({
                                error: "error"
                            });
                        }
                    }
                );
            } else {
                const { last_hit, last_pose } = req.body;
                const statUpdate = new Stats({
                    stat_id: STATS_ID,
                    last_hit: {
                        ...last_hit
                    },
                    last_pose: {
                        time_start: last_pose.time_start,
                        time_end: last_pose.time_end,
                        pose_id: last_pose.pose_id
                    }
                });

                statUpdate.save((err, r) => {
                    if (!err) {
                        res.json({
                            stats: "created",
                            r
                        });
                    }
                });
            }
        }
    );
});

router.get("/hit/:x/:y/:time", (req, res, next) => {
    Stats.findOne(
        {
            stat_id: STATS_ID
        },
        (err, item) => {
            if (!!item) {
                Stats.findOneAndUpdate(
                    {
                        stat_id: STATS_ID
                    },
                    {
                        last_hit: {
                            x: req.params.x,
                            y: req.params.y,
                            time: req.params.time
                        }
                    },
                    (err, r) => {
                        if (!err) {
                            res.json({
                                stats: "updated"
                            });
                        } else {
                            res.json({
                                error: "error"
                            });
                        }
                    }
                );
            } else {
                const statUpdate = new Stats({
                    stat_id: STATS_ID,
                    last_hit: {
                        x: req.params.x,
                        y: req.params.y,
                        time: req.params.time
                    }
                });

                statUpdate.save((err, r) => {
                    if (!err) {
                        res.json({
                            stats: "created",
                            r
                        });
                    }
                });
            }
        }
    );
});

router.delete("/", (req, res) => {
    Stats.findOneAndRemove(
        {
            stat_id: STATS_ID
        },
        (err, r) => {
            if (!err) {
                res.json({
                    stats: "deleted"
                });
            }
        }
    );
});

router.post("/", (req, res, next) => {
    const { last_hit, last_pose } = req.body;
    const statUpdate = new Stats({
        last_hit: {
            ...last_hit
        },
        last_pose: {
            ...last_pose
        }
    });

    statUpdate.save((err, r) => {
        if (!err) {
            res.json({
                stats: "ok"
            });
        }
    });
});

/* GET home page. */
router.get("/", function(req, res, next) {
    Stats.findOne(
        {
            stat_id: STATS_ID
        },
        (err, data) => {
            if (!err) {
                res.json(data);
                console.log(data);
            } else {
                res.send("Error occured");
            }
        }
    );
});

/* GET home page. */
router.get("/:bird/:flag", function(req, res, next) {
    const { bird, flag } = req.params;

    res.json({
        message: `flag ${flag} activated for bird ${bird}`
    });
});

module.exports = router;
