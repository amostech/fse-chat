/**
 * @author Arthur M Sampaio
 */
var app = require('express')();
var config = require('./config');

var ChatDAO = require('./service/dao-service');

var dao = new ChatDAO();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var bodyParser = require('body-parser')

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/messages', function (req, res, next) {
    req.timestamp = Date.now()
    console.log('Appending timestamp: ' + req.timestamp);
    next()
});

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

// REST API
app.post('/messages', function (req, res) {
    console.log(req.body);
    if (!req.body) {
        res.json({ error: config.errors['missingMessage'] });
        return;
    }

    if (!req.body.sender) {
        res.json({ error: config.errors['missingSender'] });
        return;
    }

    if (!req.body.sent_at)
        req.body.sent_at = new Date()

    dao.createMessage(req.body, function (data) {
        io.emit('message-broadcast', data);
        res.json(data);
    });
});

app.get('/messages', function (req, res) {
    dao.retrieveAllMessages(function (data) {
        res.json(data);
    });

});

app.post('/users', function (req, res) {
    console.log(req.body);
    if (!req.body) {
        res.json({ error: config.errors['missingUser'] });
        return;
    }

    req.body.created_at = new Date()
    dao.createUser(req.body, function (data) {
        io.emit('user-list-changed', data);
        res.json(data);
    });

});

app.post('/users/change-status', function (req, res) {
    console.log(req.body);

    if (!req.body.username) {
        res.json({ error: config.errors['missingUser'] });
        return;
    }

    if (!req.body.new_status) {
        res.json({ error: config.errors['missingUserStatus'] });
        return;
    }

    dao.changeUserStatus(req.body.username, req.body.new_status, function (usr) {
        io.emit('user-list-changed', usr);
        res.json(usr);
    });

});

app.get('/users', function (req, res) {
    console.log(req.body);
    dao.retrieveOnlineUsers(function (data) {
        res.json(data);
    });
});

//SOCKET.IO event handler
io.on('connection', function (socket) {
    console.log('Socket.io client Connected.');
    socket.on('login', function(obj) {
        dao.changeUserStatus(obj.username, "online", function(){
            io.emit('user-list-changed');
    });
        console.log('disconnected event');
    });

    socket.on('logout', function (obj) {
        dao.changeUserStatus(obj.username, "offline", function(){
            io.emit('user-list-changed');
        });
        console.log('disconnected event');
    });
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});