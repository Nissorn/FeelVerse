const bcrypt = require('bcryptjs');
const users = require('../../models/user');
const jwt = require("jsonwebtoken");

exports.register = async(req,res) => {
    try{
        //check user
        const{ username, password } = req.body;
        var user = await users.findOne({username})
        
        if(user){
            return res.status(400).send("User Already exists")
        }
        const salt = await bcrypt.genSalt(10)
        newUser  = new users({
            username,
            password,
        });
        //Encrypt
        user.password = await bcrypt.hash(password,salt);
        
       await user.save();
       console.log("User saved:", newUser);

       return res.send('register Success');
    }catch(err){
        console.log(err)
        res.status(500).send('servger Error')
    }

}
exports.login = async(req,res) =>{
    try{
       const { username, password }  = req.body;
       var user = await users.findOneAndUpdate({username}, { new: true});
       console.log(username,password)
       if(user && !user.enabled){
        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch){
            return res.status(400).send('Password Invalid')
        }
        //payload
        const payload = {
            user:{
                username:user.username,
                role: user.role,
            },
        };
        //Generate Token
        jwt.sign(payload,
            "jwtSecret",
            {expiresIn: 3600},(err,token)=>{
                if(err) throw err;
                res.json({token,payload})
            });
        
       }else{
        return res.status(400).send("Sent user not found")
       } 

    }catch(err){
        console.log(err)
        res.status(500).send('servger Error')
    }


};



exports.listuser = async(req,res) => {
    try{
        res.send('listuser')

    }catch(err){
        console.log(err)
        res.status(500).send('servger Error')
    }

}

exports.edituser = async(req,res) => {
    try{
        res.send('edituser')

    }catch(err){
        console.log(err)
        res.status(500).send('servger Error')
    }

}

exports.deleteuser = async(req,res) => {
    try{
        res.send('deleteuser')

    }catch(err){
        console.log(err)
        res.status(500).send('servger Error')
    }

}


