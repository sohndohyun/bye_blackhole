const openSocket = require('socket.io-client');
const socket = openSocket('http://localhost:8080/game');
export default socket;
