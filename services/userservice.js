/***************************************************************************************************************
 * @purpose	:contains services for various API
 * 
 * @author	:sangita awaghad
 * @since	:16-09-2019
 * @version :1.
 ***************************************************************************************************************/
const model = require('../models/usermodel');
const bcrypt = require('bcrypt');
const forgetMail = require('../middleware/nodeMailer')
const jwtTokenGenretor = require('../middleware/tokenGenrator')
/**encrypt method for hashing password */
function encryptPassword(password, callback) {
    // console.log("password ===> " + password);
    bcrypt.hash(password, 10, (err, data) => {
        if (err) {
            return callback(err);
        } else {

            return callback(null, data)
        }
    })
}
class userService {
    /**
     * @description service for registration api 
     * @param userRegisterDataObject : contain body data with node object format
     * @param callback : take response from model
     */
    registrationService(userRegisterDataObject) {
        let modelObj = new model.userClass()
        var initializePromise = modelObj.findUser(userRegisterDataObject);
        return new Promise(function (resovle, reject) {
            initializePromise.then(function (data) {
                encryptPassword(userRegisterDataObject.password, (err, encryptedPassword) => {
                    if (err)
                        reject({ 'error': err });
                    else {
                        let userRegistrationdetails = {
                            "firstName": userRegisterDataObject.firstName,
                            "lastName": userRegisterDataObject.lastName,
                            "email": userRegisterDataObject.email,
                            "password": encryptedPassword
                        };
                        console.log("data ===>", userRegistrationdetails)
                        var saveUserPromise = modelObj.saveUserModel(userRegistrationdetails);
                        saveUserPromise.then(function (data) {
                            resovle({ 'error': null, 'data': data })
                        }).catch(function (error) {
                            reject({ 'error': error })
                        })
                    }

                })

            }).catch(function (err) {
                reject({ 'error': err })
            })
        })

    }

    /**
     * @description service for login api 
     * @param userLoginDataObject : contain body data with node object format
     * @param callback : take response from model
     */
    loginService(userLoginDataObject) {
        let modelObj = new model.userClass();
        return new Promise(function (resovle, reject) {
            let userLoginPromise = modelObj.findUserByEmail(userLoginDataObject);
            userLoginPromise.then(function (registerdata) {
                      console.log("registration details",registerdata[0]);
                      
                bcrypt.compare(userLoginDataObject.password,registerdata[0].password, (err, data) => {
                       if (err) {
                            reject({ 'error': err });
                            console.log('bycrypt==>error');
                        } else {
                            if (data) {
                                console.log('data result :'+data)
                                let payload = {
                                    '_id': registerdata[0]._id,
                                    'email':registerdata[0].email
                                }
                                let jwtToken = jwtTokenGenretor.generateToken(payload);
                                let response = {
                                    '_id': registerdata[0]._id,
                                    'firstName': registerdata[0].firstName,
                                    'lastName': registerdata[0].lastName,
                                    'email': registerdata[0].email,
                                    'token': jwtToken.token
                                }
                                console.log('login successfully...');

                                resovle(response);
                             } else {
                                console.log('bycryp return false');
                                reject({ 'error': true ,'message':'does not match credentials'});
                            }
                        }
                    })
                
        
            }).catch(function (error) {
                reject({ 'error': error, 'message': 'user does not found' });
            })
        })
    }

    forgetPasswordService(forgetPasswordDataObject) {
        let modelObj = new model.userClass();
        return new Promise(function (resovle, reject) {
            let isUserPresent = modelObj.findUser(forgetPasswordDataObject);
            isUserPresent.then(function (data) {
                reject({ 'error': true, 'message': 'email does not found' })
            }).catch(function (error) {
                if (error.data.length <= 0) {
                    console.log('crendential does not matched');
                    reject({ 'error': null, 'data': false })
                } else {
                    console.log('your credential matched');
                    let payload = {
                        '_id': error.data[0]._id
                    }
                    let jwtTokan = jwtTokenGenretor.generateToken(payload);
                    console.log('Tokan :', jwtTokan);
                    let url = "http://localhost:3000/#/resetPassword/" + jwtTokan.token;
                    forgetMail.nodemailSender(forgetPasswordDataObject, url, jwtTokan.token, (err, data) => {
                        if (err) {
                            reject({ 'error': err, 'message': 'email sending failed' })
                        }
                        else {
                            resovle({ 'error': null, 'data': data, 'message': 'email send successfully' });
                        }
                    })
                }

            })
        })


    }
    /**
    * @description service for reset password api 
    * @param resetpasswordDataObject : contain body data with node object format
    * @param callback : take response from model
    */
    resetpasswordService(resetpasswordDataObject) {
        let modelObj = new model.userClass();
        return new Promise(function (resovle, reject) {
            encryptPassword(resetpasswordDataObject.password, (err, hashPassword) => {
                if (err) {
                    reject({ 'error': err, 'message': 'error while encrypting password' });
                } else {
                    let updatePasswordPromise = modelObj.updatePassword(resetpasswordDataObject, hashPassword);
                    updatePasswordPromise.then(function (data) {
                        resovle({ 'error': null, 'message': 'successfully updated password' });
                    }).catch(function (error) {
                        reject({ 'error': error, 'message': 'error in updateing password' });
                    })
                }
            })
        })
    }

    getAllUserService() {
        return new Promise(function (resovle, reject) {
            let modelObj = new model.userClass();
            let getAllModelPromise = modelObj.retriveAllUsers();
            getAllModelPromise.then(function (data) {
                resovle(data);
            }).catch(function (error) {
                reject(error);
            });
        });
    }
}
module.exports = { userService }