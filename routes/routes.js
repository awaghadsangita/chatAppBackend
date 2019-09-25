
var express = require('express');
var router = express.Router();
var controllerMethod = require('../controller/usercontroller');
const sendMessage=require('../controller/chatcontroller')
const tokenVerified=require('../middleware/tokenGenrator')


router.post('/registration', controllerMethod.registration);

router.post('/login', controllerMethod.login);

router.post('/forgetPassword',controllerMethod.forgetPassword);

router.post('/resetPassword',tokenVerified.verifyToken,controllerMethod.resetPassword)

router.post('/getAllUser',tokenVerified.verifyToken,controllerMethod.getAllUserControllerMethod);
router.post('/sendMessage',sendMessage.sendMessageCtrl)

router.get('/getAllMessage',sendMessage.getAllMessageCtrl)
module.exports = router;