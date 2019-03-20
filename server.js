const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

// global middleware
function bouncer(req, res, next) {
  res.status(404).json("These are not the droids you're looking for");
}

function teamNamer(req, res, next) {
  req.team = 'Web XVII'; // middleware can modify the request
  next(); // go ahead and execute the next middleware/route handler
}

// return 403 and 'you shall not pass!' when clock seconds are multiples 3, other times call next()
function moodyGateKeeper(req, res, next) {
  const seconds = new Date().getSeconds();

  if (seconds % 3 === 0) {
    res.status(403).send('You shall not pass!');
  } else {
    next();
  }
}

// server.use(bouncer);
server.use(express.json()); // built-in, no need to yarn add
server.use(helmet()); // third party, need to npm install or yarn add it
server.use(teamNamer);
// server.use(moodyGateKeeper);

// routing
server.use('/api/hubs', hubsRouter);

// route handlers ARE middleware
server.get('/', restricted, (req, res) => {
  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome ${req.team} to the Lambda Hubs API</p>
    `);
});

function restricted(req, res, next) {
  const password = req.headers.password;

  if (password === 'mellon') {
    next();
  } else {
    res.status(401).send('You shall not pass Balrog!');
  }
}

module.exports = server;
