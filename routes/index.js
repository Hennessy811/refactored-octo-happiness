var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
// const dotenv = require("dotenv");

// dotenv.config();

var kittySchema = new mongoose.Schema({
    name: String
});

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
var Kitten = mongoose.model("Kitten", kittySchema);
var Stats = mongoose.model("Stats", statsSchema);

var mongoose = require("mongoose"); //process.env.MONGODB_URI
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true
});

const STATS_ID = "arngry";

const sampleRes = {
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

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
    // we're connected!
    console.log("db ready");
});

router.post("/pose", (req, res, next) => {
    Stats.findOne({ stat_id: STATS_ID }, (err, item) => {
        if (!!item) {
            console.log(item);
            const { last_pose } = req.body;

            Stats.findOneAndUpdate(
                { stat_id: STATS_ID },
                { last_pose: { ...last_pose } },
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
                last_hit: { ...last_hit },
                last_pose: { ...last_pose }
            });

            statUpdate.save((err, r) => {
                if (!err) {
                    res.json({ stats: "created", r });
                }
            });
        }
    });
});

router.post("/hit/:x/:y", (req, res, next) => {
    Stats.findOne({ stat_id: STATS_ID }, (err, item) => {
        if (!!item) {
            // const { last_hit } = req.body;

            console.log(req.params);

            Stats.findOneAndUpdate(
                { stat_id: STATS_ID },
                { last_hit: { x: req.params.x, y: req.params.y } },
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
                last_hit: { x: req.params.x, y: req.params.y }
            });

            statUpdate.save((err, r) => {
                if (!err) {
                    res.json({ stats: "created", r });
                }
            });
        }
    });
});

router.delete("/", (req, res) => {
    Stats.findOneAndRemove({ stat_id: STATS_ID }, (err, r) => {
        if (!err) {
            res.json({
                stats: "deleted"
            });
        }
    });
});

router.post("/", (req, res, next) => {
    const { last_hit, last_pose } = req.body;
    const statUpdate = new Stats({
        last_hit: { ...last_hit },
        last_pose: { ...last_pose }
    });

    statUpdate.save((err, r) => {
        if (!err) {
            res.json({ stats: "ok" });
        }
    });
});

/* GET home page. */
router.get("/", function(req, res, next) {
    Stats.findOne({ stat_id: STATS_ID }, (err, data) => {
        if (!err) {
            res.json(data);
            console.log(data);
        } else {
            res.send("Error occured");
        }
    });
});

/* GET home page. */
router.get("/:bird/:flag", function(req, res, next) {
    const { bird, flag } = req.params;

    res.json({
        message: `flag ${flag} activated for bird ${bird}`
    });
});

module.exports = router;
