const Server = require('../express/server.js')
  , passport = require('passport')
  , util = require('util')
  , VKontakteStrategy = require('passport-vkontakte').Strategy
  , OdnoklassnikiStrategy = require('passport-odnoklassniki').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy
  , Config = require('../variables/config.js')
  , Mysql = require('../functions/mysql.js');

passport.serializeUser(async (user, done) => {
  if (user['provider'] === 'vkontakte') {
    const results = await Mysql.Query(`SELECT * FROM users WHERE identificator = ${user['id']}`);

    if (!results[0]) {
      const userAuth = {
        username: user['displayName'],
        avatar: user['photos'][0]['value'],
        identificator: user['id'],
        balance: 0.00,
        time: Date.now(),
        provider: 'vkontakte',
        promocode: '1'
      };
      const results1 = await Mysql.Query('INSERT INTO users SET ?', userAuth);
      Mysql.Query(`UPDATE users SET promocode = 'C0${results1['insertId']}' WHERE id = ${results1['insertId']}`);
    } else {
      Mysql.Query(`UPDATE users SET username = '${user['displayName']}', avatar = '${user['photos'][0]['value']}' WHERE identificator = ${user['id']}`, (error3, results3) => {
        if (error3) {
          console.log(error3);
        }
      })
    }
  } else if (user['provider'] === 'odnoklassniki') {
    const results = await Mysql.Query(`SELECT * FROM users WHERE identificator = ${user['id']}`);

    if (!results[0]) {
      const userAuth = {
        username: user['displayName'],
        avatar: user['photos'][0]['value'],
        identificator: user['id'],
        balance: 0.00,
        time: Date.now(),
        provider: 'odnoklassniki',
        promocode: '1'
      };
      const results1 = await Mysql.Query('INSERT INTO users SET ?', userAuth);
      Mysql.Query(`UPDATE users SET promocode = 'C0${results1['insertId']}' WHERE id = ${results1['insertId']}`);
    } else {
      Mysql.Query(`UPDATE users SET username = '${user['displayName']}', avatar = '${user['photos'][0]['value']}' WHERE identificator = ${user['id']}`, (error3, results3) => {
        if (error3) {
          console.log(error3);
        }
      })
    }
  } else if (user['provider'] === 'facebook') {
    const results = await Mysql.Query(`SELECT * FROM users WHERE identificator = ${user['id']}`);

    if (!results[0]) {
      const userAuth = {
        username: user['displayName'],
        avatar: user['photos'][0]['value'],
        identificator: user['id'],
        balance: 0.00,
        time: Date.now(),
        provider: 'facebook',
        promocode: '1'
      };
      const results1 = await Mysql.Query('INSERT INTO users SET ?', userAuth);
      Mysql.Query(`UPDATE users SET promocode = 'C0${results1['insertId']}' WHERE id = ${results1['insertId']}`);
    } else {
      Mysql.Query(`UPDATE users SET username = '${user['displayName']}', avatar = '${user['photos'][0]['value']}' WHERE identificator = ${user['id']}`, (error3, results3) => {
        if (error3) {
          console.log(error3);
        }
      })
    }
  }
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(new VKontakteStrategy(
  {
    clientID: Config.vk.id, // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
    clientSecret: Config.vk.secret,
    callbackURL: `http://${Config.domainBackend}/auth/vkontakte/callback`,
    scope: ['email'],
    profileFields: ['email'],
  },
  function verify(accessToken, refreshToken, params, profile, done) {

    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's VK profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the VK account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

passport.use(new OdnoklassnikiStrategy({
    clientID: Config.ok.id,
    clientPublic: Config.ok.public,
    clientSecret: Config.ok.secret,
    callbackURL: `http://${Config.domainBackend}/auth/odnoklassniki/callback`
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {

      // To keep the example simple, the user's VK profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the VK account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

passport.use(new FacebookStrategy({
    clientID: '286124035254602',
    clientSecret: 'de690980790289d2b24b82b13aa54ba1',
    callbackURL: `http://${Config.domainBackend}/auth/facebook/callback`
  },
  function(accessToken, refreshToken, profile, cb) {
    process.nextTick(function () {

      // To keep the example simple, the user's VK profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the VK account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

Server.app.use(passport.initialize());
Server.app.use(passport.session());

Server.app.get('/logout', function (req, res) {
  req.logout();
  res.redirect(`${Config.urlSite}`);
});

Server.app.get('/auth/vkontakte', passport.authenticate('vkontakte'));

Server.app.get('/auth/vkontakte/callback',
  passport.authenticate('vkontakte', {
    successRedirect: '/',
  })
);

Server.app.get('/auth/odnoklassniki', passport.authenticate('odnoklassniki'));

Server.app.get('/auth/odnoklassniki/callback',
  passport.authenticate('odnoklassniki', {
    successRedirect: '/',
  })
);

Server.app.get('/auth/facebook', passport.authenticate('facebook'));

Server.app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
  })
);
