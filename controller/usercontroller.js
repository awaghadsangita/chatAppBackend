/***************************************************************************************************************
 * @purpose	:contains controller for various API
 * 
 * @author	:sangita awaghad
 * @since	:16-09-2019
 * @version :1.0
 * 
 ***************************************************************************************************************/
const service = require('../services/userservice');
/**
 * controller for registration takes req and res as parameter
 */
class UserController {
    registration(req, res) {
        try {
            req.checkBody('firstName', 'should not be empty').notEmpty();
            req.checkBody('firstName', 'should be alphabets').isAlpha();

            req.checkBody('lastName', 'should not be empty').notEmpty();
            req.checkBody('lastName', 'should be alphabet').isAlpha();

            req.checkBody('email', 'email should not be empty').notEmpty();
            req.checkBody('email', 'email sould be valide').isEmail();

            req.checkBody('password', 'password should be have length 6 ').isLength({ min: 6 })
            req.checkBody('password', 'password should be have max length 12').isLength({ max: 12 })

            let error = req.validationErrors();//returns validation errors
            let response = {};//create response object

            if (error) {
                /** make response array with it's field */
                response.suceess = false;
                response.error = error
                /** send response to server */
                res.status(400).send(response)

            } else {
                /**parsing body data into node object */
                let userRegisterDataObject = {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password
                }
                /**call registration service and handle callback */
                let serviceObj = new service.userService();
                var initilaizePromise = serviceObj.registrationService(userRegisterDataObject);
                initilaizePromise.then(function (data) {
                    /** make response array with it's field */
                    response.success = true;
                    response.content = data;
                    /** send response to server */
                    res.status(200).send(response)
                }, function (err) {
                    /** make response array with it's field */
                    response.success = false;
                    response.error = err;
                    /** send response to server */
                    res.status(422).send(response)
                })

            }
        } catch (e) {
            console.log('Error occured ', e);
        }
    }
    /**
 * controller for login API and it take request and response as parameter
 */
    login(req, res) {
        try {
            console.log("in controller");

            req.checkBody('email', 'email should not be empty').notEmpty();
            req.checkBody('email', 'email should be valide').isEmail();

            req.checkBody('password', 'password should be have length 6 ').isLength({ min: 6 });
            req.checkBody('password', 'password should be have max length 12').isLength({ max: 12 });

            let error = req.validationErrors();//returns validation error
            let response = {};

            if (error) {
                /** make response array with it's field */
                response.success = false;
                response.error = error;
                /** send response to server */
                return res.status(400).send(response);
            }
            else {
                /**parsing body data into node object */
                let userLoginDataObject = {
                    email: req.body.email,
                    password: req.body.password
                }
                /**calling login service and handle callback */
                let serviceObj = new service.userService();
                let loginServicePromise = serviceObj.loginService(userLoginDataObject);
                loginServicePromise.then(function (data) {
                    if (data) {
                        /** make response array with it's field */
                        console.log("in controller ",data);
                        
                        response.success = true;
                        response.content = data;
                        /** send response to server */
                        res.status(200).send(response);
                    }
                }, function (err) {
                    /** make response array with it's field */
                    response.success = false;
                    response.error = err;
                    /** send response to server */
                    res.status(422).send(response);
                })
            }
        } catch (e) {
            console.log('Error Occured ', e);
        }
    }
    /**controller for forgetPassword API and it takes request and response as arguments */
    forgetPassword(req, res) {
        try {

            req.checkBody('email', 'email should not be empty').notEmpty();
            req.checkBody('email', 'email should be valide').isEmail();

            let error = req.validationErrors();//returns validation error
            let response = {};

            if (error) {
                /** make response array with it's field */
                response.suceess = false;
                response.message = "Error occured in request at the time of validation";
                response.error = error
                /** send respose to server  */
                return res.status(400).send(response)

            } else {

                /** parsing body data into node object  */
                let userForgetPasswordDataObject = {
                    email: req.body.email
                }

                /** 
                 * call service method and passs node object which have body data
                 * callback get ans from service in form of err and data
                 */
                let serviceObj = new service.userService();
                let forgetPasswordServicePromise = serviceObj.forgetPasswordService(userForgetPasswordDataObject);
                forgetPasswordServicePromise.then(function (data) {
                    response.success = true;
                    response.message = "Email sending successfully for forget password"
                    response.content = data;
                    /** send respose to server  */
                    res.status(200).send(response)
                }).catch(function (error) {
                    response.success = false;
                    response.message = "Email sending failed for forget password"
                    response.error = error;
                    /** send respose to server  */
                    res.status(422).send(response)
                })

                // service.forgetPasswordService(userForgetPasswordDataObject, (err, data) => {
                //     if (err) {
                //         /** make response array with it's field */
                //         response.success = false;
                //         response.message = "Email sending failed for forget password"
                //         response.error = err;
                //         /** send respose to server  */
                //         res.status(422).send(response)
                //     } else {
                //         /** make response array with it's field */
                //         response.success = true;
                //         response.message = "Email sending successfully for forget password"
                //         response.content = data;
                //         /** send respose to server  */
                //         res.status(200).send(response)
                //     }

                // })
            }
        } catch (e) {
            console.log(e);

        }
    }
    resetPassword(req, res) {
        try {

            console.log("req data", JSON.stringify(req.token._id));

            req.checkBody('password', 'password should be have length 6 ').isLength({ min: 6 })
            req.checkBody('password', 'password should be have max length 20').isLength({ max: 20 })

            console.log("backend controller called ");

            let error = req.validationErrors();
            let response = {};

            if (error) {
                /** make response array with it's field */
                response.suceess = false;
                response.message = "Error occured in request after processing request";
                response.error = error
                /** send respose to server  */
                return res.status(400).send(response)

            } else {

                /** parsing body data into node object  */
                //let token=JSON.stringify(req.token);

                let userResetPasswordDataObject = {
                    password: req.body.password,
                    _id: req.token._id

                }

                /** 
                 * call service method and passs node object which have body data
                 * callback get ans from service in form of err and data
                 */
                let serviceObj = new service.userService();
                let resetPasswordServicePromise = serviceObj.resetpasswordService(userResetPasswordDataObject);
                resetPasswordServicePromise.then(function (data) {
                    /** make response array with it's field */
                    response.success = true;
                    response.message = "reset Password done"
                    response.content = data;
                    /** send respose to server  */
                    res.status(200).send(response);
                }).catch(function (err) {
                    /** make response array with it's field */
                    response.success = false;
                    response.message = "reset Password not done"
                    response.error = err;
                    /** send respose to server  */
                    res.status(422).send(response);
                })
            }
        } catch (e) {
            console.log(e);

        }
    }
    getAllUserControllerMethod(req,res)
    {
        try{
            console.log('all user controller')
            let serviceObj=new service.userService();
            let response={};
            let getAllUserServicePromise=serviceObj.getAllUserService();
            getAllUserServicePromise.then(function(data){
                response.success = true;
                response.message = "retrive all user successfully"
                response.content = data;
                // console.log("All user Data ==>"+response.content);
                /** send respose to server  */
                res.status(200).send(response);
            }).catch(function(error){
                /** make response array with it's field */
                response.success = false;
                response.message = "error in retriving user details"
                response.error = error;
                /** send respose to server  */
                res.status(422).send(response);
            });
        }catch(e)
        {
            console.log(e)
        }
    }
}

module.exports = new UserController();