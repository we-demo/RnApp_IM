const ws = new WebSocket('ws://192.168.1.2:3000')
const EventEmitter = require('EventEmitter')
const em = new EventEmitter()

ws.onmessage = e => {
  console.log('WebSocket received: ', e.data)
  em.emit('message', JSON.parse(e.data))
}

ws.onopen = () => {
  console.log('WebSocket connection opened')
  em.emit('open')
}

ws.onclose = e => {
  console.log('WebSocket connection closed', e.code, e.reason)
  em.emit('close', e.code, e.reason)
}

ws.onerror = e => {
  console.log('WebSocket error: ', e)

  // message is null when ws closed
  if (e.message) {
    em.emit('error', e.message)
    alert('WebSocket error: ' + e.message)
  }
}

em.send = function send (data) {
  ws.send(JSON.stringify(data))
}

// em.setMaxListeners(15)

export default em
