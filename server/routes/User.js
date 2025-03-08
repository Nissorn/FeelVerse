const express = require('express');
const router = express.Router();

//import controller
const { create } = require('../src/controllers/user');
router.get('/user',create)

module.exports=router;