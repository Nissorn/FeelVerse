const express = require('express');
const router = express.Router();

//import controller
const { create } = require('../src/controllers/Planet');
router.get('/Planet',create)

module.exports=router;