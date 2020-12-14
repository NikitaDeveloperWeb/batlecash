const express = require('express'),
    session = require('express-session'),
    connectRedis = require('connect-redis'),
    redis = require('redis'),
    Config = require('../variables/config.js'),
    bodyParser = require("body-parser"),
    sha256 = require('sha256'),
    Mysql = require('../functions/mysql.js'),
    User = require('../models/user.js'),
    md5 = require('md5');

const redisClient = redis.createClient();
const RedisStore = connectRedis(session);
const dbSession = new RedisStore({
    client: redisClient,
    host: 'localhost',
    prefix: '',
    disableTTL: true
});

const Server = {};

Server.Session = session({
    resave: true,
    saveUninitialized: true,
    key: 'SID', // this will be used for the session cookie identifier
    secret: 'asdkajdulodyqwuelqwd',
    store: dbSession
});

Server.app = express();
Server.app.use(Server.Session);
Server.app.use(bodyParser.urlencoded({ extended: false }));
Server.app.use(bodyParser.json());

Server.app.get('/', function (req, res) {
    res.redirect(`${Config.urlSite}`);
});

Server.app.post('/payment/check', async (req, res) => {
  if (typeof req.body['AMOUNT'] !== "undefined" && typeof req.body['MERCHANT_ORDER_ID'] !== "undefined") {
    const sign = md5(`${Config.fk.id}:${req.body['AMOUNT']}:${Config.fk.secret2}:${req.body['MERCHANT_ORDER_ID']}`);

    if (sign === req.body['SIGN']) {
      const payment = await Mysql.Query(`SELECT * FROM payments WHERE id = ${req.body['MERCHANT_ORDER_ID']} AND status = 0`);
      if (payment.length === 0) {return res.send(`NO`)};
      const user = await Mysql.Query(`SELECT * FROM users WHERE id = ${payment[0]['user_id']}`);
      if (user.length === 0) {return res.send(`NO`)};
      await Mysql.Query(`UPDATE users SET balance = ${parseFloat(user[0]['balance']) + parseFloat(payment[0]['sum'])} WHERE id = ${payment[0]['user_id']}`);
      await Mysql.Query(`UPDATE payments SET status = 1 WHERE id = ${payment[0]['id']}`);
      const payments = await Mysql.Query(`SELECT * FROM payments WHERE user_id = ${user[0]['id']} AND status = 1`);
      let sum = 0;
      for (const payment1 of payments) {
          sum += payment1['sum'];
      }
      if (sum >= 1000 && user[0]['status'] === 0) {
          await Mysql.Query(`UPDATE users SET status = 1 WHERE id = ${user[0]['id']}`);
      } else if (sum >= 3000 && user['0']['status'] === 0) {
          await Mysql.Query(`UPDATE users SET status = 2 WHERE id = ${user[0]['id']}`);
      }
      return res.send(`YES`);
    } else {
      return res.send(`NO`);
    }
  }
});

Server.app.listen(3000);

User.checksWithdraws();

module.exports = Server;

const VkAuth = require('../auth/vkauth.js');
const Socket = require('../functions/socket.js');
