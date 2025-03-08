const express = require('express');
const router = express.Router();

router.get('/planet', (req, res) => {
    res.send('hello5555')
    
})

module.exports=router;