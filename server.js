/***************************************************************************************************************
 * @file	:server.js
 * 
 * @author	:sangita awaghad
 * @since	:16-09-2019
 * @version :1.0
 * 
 ***************************************************************************************************************/
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose =require('mongoose');
var expressValidator=require('express-validator');
const chatController=require('./controller/chatcontroller')
mongoose.set('useCreateIndex', true);//deprecation warning hiding
mongoose.set('useUnifiedTopology', true);
const socketIO = require('socket.io');
var router = require('./routes/routes');
var PORT = 3000;


app.use(express.static('../chatAppFrontend')) //front end connection 

app.use(expressValidator());

app.use(bodyParser.json());

app.use('/', router);


mongoose.connect('mongodb://127.0.0.1:27017/chatappDB', { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log("Connection failed because " + err);
    } else {
        console.log("MongoDB database connection established successfully");
    }

})

 const server=app.listen(PORT, ()=> {
    console.log("Server is running on Port: " + PORT);
});

let io=socketIO(server);

io.on("connection",function(socket){
    console.log('socket connected');
    socket.on('messageContainer',(message)=>{
        console.log(message.senderID)
        io.emit(String(message.receiverID),message);
               
        let sendMsgCtrlPromise=chatController.sendMessageCtrl(message);
        sendMsgCtrlPromise.then(function(data){
            console.log("mydata ",message)
        }).catch(function(err){
            return  err;
        });
    })
    
    socket.on("disconnect",()=>{
        console.log('socket disconnected');
    })
})