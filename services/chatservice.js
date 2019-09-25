const model = require('../models/chatmodel')
class chatService {
    /** just forworded request for saving message data */
    sendMessageService(messageData) {
        try {
            return new Promise(function (resolve, reject) {
                let sendMessageModelPromise = model.saveSendMessage(messageData);
                sendMessageModelPromise.then(function (data) {
                    resolve(data)
                }).catch(function (err) {
                    reject(err);
                })
            })
        } catch (e) {
            console.log('error occured ', e);
        }
    }

    /** just forworded request for getting all message  */
    getAllMessage() {
        try {
            return new Promise(function (resolve, reject) {
                let modelPromise = model.getAllMessage();
                modelPromise.then(function (data) {
                    resolve(data);
                }).catch(function (err) {
                    reject(err);
                })
            })
        } catch (e) {
            console.log('error occured ', e);
        }
    }
}

module.exports = new chatService();