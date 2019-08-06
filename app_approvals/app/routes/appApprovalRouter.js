const express = require('express');
const router = express.Router();
const DbService = require("../services/DbService");

/* GET users listing. */
router.get('/', function(req, res, next) {
  return res.send(DbService.create().getAppApprovals());
});

module.exports = router;
