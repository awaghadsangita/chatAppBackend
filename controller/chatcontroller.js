const service = require('../services/chatservice');
class Controller {
    constructor() {

    }

    sendMessageCtrl(req) {
        try {
            return new Promise(function(resolve,reject){
            // get all message data and bind into object 
            let messageData = {
                'senderID': req.senderID,
                'senderName': req.senderName,
                'receiverID': req.receiverID,
                'receiverName': req.receiverName,
                'message': req.message
            }
            // called next method 
            let sendmessageServicePromise = service.sendMessageService(messageData);
            sendmessageServicePromise.then(function (data) {
                console.log("massage save successfully ");
                resolve(data);
            }, function (err) {
                console.log("Error while saving message ", err);
                reject(err);
            })
        });
        } catch (err) {
            console.log(err);
        }
    }

    /** get all message with sender and receiver details */
    getAllMessageCtrl(req, res) {
        try {
            // called next method 
            let response = {};
            let getallmessageServicePromise=service.getAllMessage();
            getallmessageServicePromise.then(function(data){
                // make response array with it's field 
                response.success = true;
                response.message = "get all message successful"
                response.content = data;
                // send respose to server 
                return res.status(200).send(response)
            }).catch(function(err){
                //make response array with it's field
                response.success = false;
                response.error = err;
                response.message = "get all message failed"
                // send respose to server 
                return res.status(422).send(response)
            })
        } catch (err) {
            console.log(err);
        }
    }

}

const controllerObj = new Controller();
module.exports = controllerObj;