
// Configure your server here
// Build your actions router in /api/actions/actions-router.js
// Build your projects router in /api/projects/projects-router.js
// Do NOT `server.listen()` inside this file!
const express = require('express');
const { logger } = require('./actions/actions-middlware')
const projectsRouter = require('./projects/projects-router');
const actionsRouter = require('./actions/actions-router');

const server = express();

server.use(express.json());
server.use(logger);

server.use('/api/projects', projectsRouter);
server.use('/api/actions', actionsRouter);

// const port = process.env.PORT || 9000;
// server.listen(port, () => {
//   console.log(`Server is running on ${port}`);
// });


module.exports = server;
