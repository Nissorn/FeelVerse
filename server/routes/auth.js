const express = require('express');
const router = express.Router();


const { register,login, listuser, edituser, deleteuser } = require('../src/controllers/auth');

//middleware
const { auth } =require('../src/middleware/auth');




//enpoint
router.post("/register",register);


router.post("/login",login);

router.get('/1',auth,(req,res) =>{
    res.send('hello 1')


})

router.get('/2',auth,(req,res) =>{
    res.send('hello 2')


})


router.get('/auth',listuser);

router.put('/auth',edituser); 

router.delete('/auth',deleteuser); 

module.exports=router;