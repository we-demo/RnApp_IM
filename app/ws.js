const ws = new WebSocket('ws://localhost:3000')

ws.onopen = () => {
    console.log('WebSocket connection opened')
}
ws.onclose = (e) => {
    console.log('WebSocket connection closed', e.code, e.reason)
}
ws.onerror = (e) => {
    alert('WebSocket error: ' + e.message)
    console.log('WebSocket error: ', e)
}
// ws.onmessage = (e) => {
//     // dispatch(receiveMessage(e.data))
//     console.log('WebSocket received: ' + e.data)
// }

export default ws
