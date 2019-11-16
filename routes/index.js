var express = require('express');
var router = express.Router();

const sampleRes = {
  "last_hit": {
    "time": new Date().getTime(),
    "x": 100,
    "y": 120,
    "strength": 20,
    "id": 21341,
  },
  "last_pose": {
    "time_start": new Date().getTime() - 10000,
    "time_end": new Date().getTime() - 5000,
    "pose_id": 1,
  },
}


/* GET home page. */
router.get('/', function (req, res, next) {
  // res.render('index', { title: 'Express' });
  res.json(sampleRes)
});

module.exports = router;