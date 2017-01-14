//chat-dao.js
var mongoose = require('mongoose');
var config = require('../config');

/**
 * models
 */
var User = require('../model/User')
var Message = require('../model/Message')

module.exports = class ChatDAO {

    constructor() {
        this.db = mongoose.connection;
        this.connected = false;
        this.connect();
    }

    errorHandler() {
        console.log('MongoDB Error Connecting to database');
    }

    openHandler() {
        console.log('MongoDB connection succesfull');
        this.connected = true;
    }

    connect() {
        if (!this.connected) {
            mongoose.connect(config.mongo_url);
            this.db.on('error', this.errorHandler);
            this.db.once('open', this.openHandler);
        }
    }
    createUser(userObj, callback) {

        var userEntity = new User(userObj);

        userEntity.save()
            .catch(function (errors) {
                var obj = {};
                if (errors.code === 11000) //DUPLICATE_KEY MONGOOSE
                    obj.error = config.errors['userExists'];

                callback(obj);
            })
            .then(callback);
    }

    findUserByUsername(usrName, callback) {
        User
            .findOne({ username: usrName })
            .catch(function (err) {
                throw err;
            }).then(callback);
    }

    retrieveOnlineUsers(callback) {
        User
            .find({})
            .then(callback);
    }

    changeUserStatus(usrName, newStatus, callback) {
        User
            .findOneAndUpdate({ username: usrName }, { $set: { status: newStatus } }, { new: true /*need to return the updated document!*/ }, function (err, data) {
                if (err) throw err;
                callback(data);
            });
    }


    createMessage(messageObj, callback) {

        var msgEntity = new Message(messageObj);

        this.findUserByUsername(messageObj.sender.username, function (data) {
            msgEntity.sender = data;
            msgEntity.save()
                .catch(callback)
                .then(callback);
        });

    }

    retrieveAllMessages(callback) {
        Message
            .find({})
            .populate('sender')
            .then(callback);
    }
}