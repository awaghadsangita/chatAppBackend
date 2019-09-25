/***************************************************************************************************************
 * @purpose	:contains models for various api
 * 
 * @author	:sangita awaghad
 * @since	:16-09-2019
 * @version :1.0
 * 
 ***************************************************************************************************************/
const mongoose = require('mongoose');
const bycrypt = require('bcrypt');
const forgetMail = require('../middleware/nodeMailer')
const jwtTokenGenretor = require('../middleware/tokenGenrator')
const userschema = mongoose.Schema;
//mongoose.Promise=global.Promise;
/**access the Schema constructor from the mongoose singleton*/
let userSchemaData = new userschema({
    firstName: {
        type: String,
        require:[true,"first name should be required"]
    },
    lastName: {
        type: String,
        require:[true,"last name should be required"]
    },
    email: {
        type: String,
        unique:true,
        require:[true,"email should be required"]

    },
    password: {
        type: String,
        require:[true,"password should be required"]
    }
}, {
    timestamps: true
});
/**Models are defined by passing a Schema instance to mongoose.model.*/
let userSchemaModel = mongoose.model("schemaModel", userSchemaData);

/**model for registartion api */
class userClass{
    findUser(userRegisterDataObject){
         return new Promise(function(resovle,reject){
        userSchemaModel.find({ 'email': userRegisterDataObject.email },['_id','firstName','lastName','email','password']).then(
            function(data){
                if(data.length>0)
                {
                    console.log('user already exist'+data)
                    reject({'error':null,'message':'email already exist','data':data})
                }
                else{
                    console.log('User does not exist')
                    resovle({'error':false,'data':userRegisterDataObject})
                }

            }
        ).catch(function(err){
            reject({'error':err,'message':'error in finding email'})
        })
       })
    }
    findUserByEmail(userRegisterDataObject){
        return new Promise(function(resovle,reject){
       userSchemaModel.find({ 'email': userRegisterDataObject.email },['_id','firstName','lastName','email','password']).then(
           function(data){
               if(data.length>0)
               {
                   console.log('user already exist',data)
                   resovle(data)
               }
               else{
                   console.log('User does not exist');
                   reject({'error':true,'message':'user does not exist'})
               }

           }
       ).catch(function(err){
           reject({'error':err,'message':'error in finding email'})
       })
      })
   }
    saveUserModel(userRegistrationdetails){

        return new Promise(function(resovle,reject){
            let userRegistrationdetail = new userSchemaModel({
                "firstName": userRegistrationdetails.firstName,
                "lastName": userRegistrationdetails.lastName,
                "email": userRegistrationdetails.email,
                "password": userRegistrationdetails.password
            });
            console.log("saveUSerMode")
            userRegistrationdetail.save().then(function(data){
                resovle({'error':false,'message': 'registration successfull'})
            }).catch(function(error){
                reject({'error':error,'message': 'registration failed'})
            })

        })
    }
    
    updatePassword(resetpasswordDataObject,hashPassword){
        return new Promise(function(resovle,reject){
            userSchemaModel.findOneAndUpdate({'_id':resetpasswordDataObject._id},{$set:{'password':hashPassword}})
            .then(function(data){
                resovle({'error':null,'message':'successfully updated password'})
            }).catch(function(error){
                reject({'error':error,'message':'error while updating password'})
            })
        })
    }

    retriveAllUsers()
    {
        return new Promise(function(resovle,reject){
            userSchemaModel.find({},['firstName','lastName']).
            then(function(data){
                resovle(data);
            }).catch(function(error){
                reject(error);
            });
        });
    }

}

module.exports={userClass}