/***************************************************************************************************************
 * @purpose	:contains genrateToken method for generating token and token varify method for verifying token
 * 
 * @author	:sangita awaghad
 * @since	:16-09-2019
 * @version :1.0
 * 
 ***************************************************************************************************************/

var jwt = require('jsonwebtoken');
require('dotenv').config();

/**generate the token */
exports.generateToken=(payload)=>{
    /**Create a new token with the _id in the payload and which expires 24hours after issue*/
    let token = jwt.sign(payload,'privateKey', {
        expiresIn: '24h' 
     });

     let object={
         success:true,
         message:"token generated",
         token:token
     }
     return object;
}
/**verify the token */
exports.verifyToken=(req,res,next)=>{

    let token=req.body.token ||req.headers['token'] || req.headers['authorization'];;
    console.log("token  ",req.body.token);
    
    if(token){
        jwt.verify(token,'privateKey',(err,decoded)=>{
            if(err)
            {
                res.status(400).send(err +" Token has expired")//400 for bad request 
            }else{
                console.log("token "+JSON.stringify(decoded));
                req.token=decoded;
                next();
            }
        })
    }else{
        let response={};
        response.success = false;
        response.message = "token not receive"
        console.log("token not receive");
        res.status(400).send(response);
    }
 
}