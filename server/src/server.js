const app = require('./app');
require('dotenv').config();
const http = require('http');
const { initializeSocket } = require('./socket/socketManager');

const PORT = process.env.PORT || 3001;

const server = http.createServer(app);
initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});