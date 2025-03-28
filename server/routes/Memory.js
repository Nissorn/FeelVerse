const express = require('express');
const router = express.Router();

//import controller
const { create } = require('../src/controllers/Memory');
console.log(create)
router.get('/Memory',create)

module.exports=router;