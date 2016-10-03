var Chance = require('chance')
var WebSocketServer = require('ws').Server
var wss = new WebSocketServer({
    host: 'localhost',
    port: 3000
})
var chance = new Chance()

var onlineUsers = []
var colors = ['#2196F3', '#009688', '#EF6C00', '#01579B', '#CCC907']

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        client.send(data)
    })
}

wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(data) {
        var msg = JSON.parse(data)

        if (msg.type === 'serverJOIN') {
            console.log(msg.user.name + ' joined')

            if (onlineUsers.indexOf(msg.user.name) === -1) {
                onlineUsers.push(msg.user.name)
            }

            return wss.broadcast(JSON.stringify({
              id: chance.guid(),
              user: {
                name: 'Server'
              },
              text: `${msg.user.name} joined.`,
              color: '#5D70C2',
            }))
        }

        if (msg.user.type === 'serverLEAVE') {
            console.log(msg.user.name + ' left')

            var userIndex = onlineUsers.indexOf(msg.user.name)
            if (userIndex > -1) {
                onlineUsers.splice(userIndex, 1)
            }

            return wss.broadcast(JSON.stringify({
              id: chance.guid(),
              user: {
                name: 'Server'
              },
              text: `${msg.user.name} left.`,
              color: '#5D70C2',
            }))
        }

        var currentUser = onlineUsers.indexOf(msg.user.name)
        if (currentUser === -1) return
        msg.color = colors[currentUser % colors.length]
        wss.broadcast(JSON.stringify(msg))
        console.log(msg.user.name + ' ' + msg.color + ' ' + msg.text)
    })

})
