const express = require('express');
const router = express.Router();


const { register,login, listuser, edituser, deleteuser } = require('../src/controllers/auth');

//enpoint
router.post("/register",register);


router.post("/login",login);



router.get('/auth',listuser);

router.put('/auth',edituser); 

router.delete('/auth',deleteuser); 

module.exports=router;