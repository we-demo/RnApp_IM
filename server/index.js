var WebSocketServer = require('ws').Server
var wss = new WebSocketServer({
    host: 'localhost',
    port: 3000
})

var onlineUsers = []
var colors = ['#2196F3', '#009688', '#EF6C00', '#01579B', '#CCC907', ]
var dilem = '{<>}'

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

            if (onlineUsers.indexOf(msg.user.id) === -1) {
                onlineUsers.push(msg.user.id)
            }

            return wss.broadcast(JSON.stringify({
              user: {
                id: 'server',
                name: 'Server'
              },
              text: `${msg.user.name} joined.`,
              color: '5D70C2',
            }))
        }

        if (msg.user.type === 'serverLEAVE') {
            console.log(msg.user.name + ' left')

            var userIndex = onlineUsers.indexOf(msg.user.id)
            if (userIndex > -1) {
                onlineUsers.splice(userIndex, 1)
            }

            return wss.broadcast(JSON.stringify({
              user: {
                id: 'server',
                name: 'Server'
              },
              text: `${msg.user.name} left.`,
              color: '5D70C2',
            }))
        }


        var currentUser = onlineUsers.indexOf(msg.user.id)
        wss.broadcast(JSON.stringify(msg))
        console.log(msg.user.name + ' ' + colors[currentUser] + ' ' + msg.text)
    })

})
