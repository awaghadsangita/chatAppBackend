const mongoose = require('mongoose');

/** defining chating model schema */
let chatSchema = mongoose.Schema({

    senderID: {
        type: String,
        unique: false,
        require: [true, "sender Id is required"]
    },
    senderName: {
        type: String,
        require: [true, "sender name is required"]
    },

    receiverID: {
        type: String,
        require: [true, "receiver Id is required"]
    },

    receiverName: {
        type: String,
        unique: false,
        require: [true, "receiver name is required"]
    },

    message: {
        type: String,
        require: [true, "message should not empty"]
    }

}, {
    timestamps: true
});

/** creating collection with predefine schema */
let chatData = mongoose.model("chatCollection", chatSchema)

class ChatModel {
    /** save sender and receiver information */
    saveSendMessage(chattingData) {
        try {
            return new Promise(function (resolve, reject) {
                /** saving message with sender and receiver information */

                let messagedetails = new chatData({
                    "senderID": chattingData.senderID,
                    "senderName": chattingData.senderName,
                    "receiverID": chattingData.receiverID,
                    "receiverName": chattingData.receiverName,
                    "message": chattingData.message
                })

                /** mongoose save methoded called to save all data */
                messagedetails.save().then(function (data) {
                    console.log("message saved data in database successfully");
                    resolve(data)
                }).catch(function (err) {
                    console.log("error occured while saving message", err);
                    reject(err);
                })
            })
        } catch (e) {
            console.log('error occured ', e);
        }

    }
    /** get all message details which is saved as schema format */
    getAllMessage() {
        try {
            /** get all message info  */
            return new Promise(function (resolve, reject) {
                chatData.find({}).then(function (data) {
                    resolve(data)
                }).catch(function (err) {
                    reject(err);
                })
            })
        } catch (e) {
            console.log('error occured ', e);
        }
    }
}
module.exports = new ChatModel();