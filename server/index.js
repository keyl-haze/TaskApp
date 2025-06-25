require('./globals');

const cors = require('cors');
const express = require('express');

const sequelize = require('./models').sequelize;
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = parseInt(process.env.PORT || '8080', 10);

app.use(cors());
app.set('query parser', 'extended');
app.use(express.json());

app.get('/api/v1/test', (req, res) => {
  res.json({ message: 'Hello from the backend! :)' });
});

require('./routes')(app);

const serverSequelizeStore = new SequelizeStore({
  db: sequelize
});
serverSequelizeStore.sync();
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.DB_SESSION_KEY,
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
