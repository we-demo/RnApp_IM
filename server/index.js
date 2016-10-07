var Chance = require('chance')
var WebSocketServer = require('ws').Server
var wss = new WebSocketServer({
    host: '192.168.1.2',
    port: 3000
})
var chance = new Chance()

var messages = []
var onlineUsers = []
var colors = ['#2196F3', '#009688', '#EF6C00', '#01579B', '#CCC907']
var limit = 50

function addMsg (msg) {
    if (messages.length >= limit) {
        messages.splice(0, limit - messages.length + 1)
    }
    messages.push(msg)
}

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        client.send(data)
    })
}

wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(data) {
        var msg = JSON.parse(data)
        console.log('received message:', data)

        if (msg.type === 'serverJOIN') {
            console.log(msg.user.name + ' joined')

            if (onlineUsers.indexOf(msg.user.name) === -1) {
                onlineUsers.push(msg.user.name)
            }

            var newMsg = {
              id: chance.guid(),
              user: {
                name: 'Server'
              },
              text: `${msg.user.name} joined.`,
              color: '#5D70C2',
            }
            messages.push(newMsg)
            return wss.broadcast(JSON.stringify(newMsg))
        }

        if (msg.type === 'allMessages') {
            return ws.send(JSON.stringify({
                type: 'allMessages',
                messages
            }))
        }

        // if (msg.type === 'serverLEAVE') {
        //     console.log(msg.user.name + ' left')

        //     var userIndex = onlineUsers.indexOf(msg.user.name)
        //     if (userIndex > -1) {
        //         onlineUsers.splice(userIndex, 1)
        //     }

        //     return wss.broadcast(JSON.stringify({
        //       id: chance.guid(),
        //       user: {
        //         name: 'Server'
        //       },
        //       text: `${msg.user.name} left.`,
        //       color: '#5D70C2',
        //     }))
        // }

        var currentUser = onlineUsers.indexOf(msg.user.name)
        if (currentUser === -1) return

        msg.type = 'message'
        msg.color = colors[currentUser % colors.length]

        messages.push(msg)
        wss.broadcast(JSON.stringify(msg))
        console.log(msg.user.name + ' ' + msg.color + ' ' + msg.text)
    })

})
