require('./globals');

const cors = require('cors');
const express = require('express');

const secrets = require(`./secrets/${__env}`).database.taskManagement;
const sequelize = require('./models').sequelize;
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = parseInt(process.env.PORT || '8080', 10);

app.use(cors());
app.use(express.json());

app.get('/api/v1/test', (req, res) => {
  res.json({ message: 'Hello from the backend! :)' });
});

const serverSequelizeStore = new SequelizeStore({
  db: sequelize
});
serverSequelizeStore.sync();
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: secrets.sessionKey,
    store: serverSequelizeStore
  })
);

app.listen(PORT, (err) => {
  if (err) {
    return console.error(err.message);
  }

  // eslint-disable-next-line no-console
  console.log(`Backend server running on http://localhost:${PORT}`);
  return null;
});
