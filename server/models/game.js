const Mysql     = require('../functions/mysql.js');
const Logger    = require('../functions/logger.js');
const Socket    = require('../functions/socket.js');
const User      = require('../models/user.js');
const RandomORG = require('random-org');
const Config = require('../variables/config.js');
const Random = new RandomORG({ apiKey: Config.ApiRandomORG });

const redis = require('redis');

const redisClient = redis.createClient();

const {promisify} = require('util');
const getAsync = promisify(redisClient.get).bind(redisClient);

const Game = {};
let io = {};

const timer = 20;
let time = 0;



Game.thisGame = async () => {
  const rows = await Mysql.Query(`SELECT * FROM game ORDER BY id DESC`);

  return rows[0];
};

Game.newGame = async () => {
  const insertGame = await Mysql.Query(`INSERT INTO game SET time = ${Date.now()}, json = '', signature = ''`);
  const game = await Mysql.Query(`SELECT * FROM game WHERE id = ${insertGame['insertId']}`);

  return game[0];
};

Game.load = async () => {
  const game = await Game.thisGame();

  const betsRedSql = await Mysql.Query(`SELECT * FROM bets WHERE game_id = ${game['id']} AND color = 'red' ORDER BY sum DESC`);
  const betsBlueSql = await Mysql.Query(`SELECT * FROM bets WHERE game_id = ${game['id']} AND color = 'blue' ORDER BY sum DESC`);

  let red_list = "";
  let blue_list = "";

  if (betsRedSql.length > 0) {
    for (bet of betsRedSql) {
      const user = await Mysql.Query(`SELECT * FROM users WHERE id = ${bet['user_id']}`);
      red_list += '<div class=\"list-item flex\" style=\"justify-content: left;\"><div class=\"ava\" style=\"background-image: url(' + user[0]['avatar'] + ');\"></div><div class=\"name\">' + user[0]['username'] + '</div><div class=\"sum\">' + bet['sum'] + '</div></div>';
    }
  }
  if (betsBlueSql.length > 0) {
    for (bet of betsBlueSql) {
      const user = await Mysql.Query(`SELECT * FROM users WHERE id = ${bet['user_id']}`);
      blue_list += '<div class=\"list-item flex\" style=\"justify-content: left;\"><div class=\"ava\" style=\"background-image: url(' + user[0]['avatar'] + ');\"></div><div class=\"name\">' + user[0]['username'] + '</div><div class=\"sum\">' + bet['sum'] + '</div></div>';
    }
  }


let red = 0;
  let blue = 0;

  if (game['red_sum'] > 0 && game['blue_sum'] > 0) {
    const allBank = game['red_sum'] + game['blue_sum'];
    red = (((game['red_sum'] * 100) / allBank) / 100).toFixed(2);
    blue = (((game['blue_sum'] * 100) / allBank) / 100).toFixed(2);
  }
  const games = await Mysql.Query(`SELECT * FROM game WHERE status = 3 ORDER BY id DESC LIMIT 20`);

  return {
    'red': red,
    'blue': blue,
    'red_list': red_list,
    'blue_list': blue_list,
    'red_sum': game['red_sum'],
    'blue_sum': game['blue_sum'],
    'games': games
  };
};

Game.startTimer = async () => {
  const game = await Game.thisGame();
  await Mysql.Query(`UPDATE game SET status = 1 WHERE id = ${game['id']}`);
  time = 0;
  if (game['status'] === 0 && time === 0) {
    const gameTimer = setInterval( () => {
      if (time === 17) Mysql.Query(`UPDATE game SET status = 2 WHERE id = ${game['id']}`);
      if (time !== timer) {
        io.sockets.emit('game.timer', {time: time});
        time++;
      } else {
        clearInterval(gameTimer);
        Game.startSlider();
      }
    }, 1000);
  }
};

Game.startSlider = async () => {
  const game = await Game.thisGame();

  let red = 0;
  let blue = 0;
  let coef = 0;

  if (game['red_sum'] > 0 && game['blue_sum'] > 0) {
    const allBank = game['red_sum'] + game['blue_sum'];
    red = (((game['red_sum'] * 100) / allBank) / 100).toFixed(2);
    blue = (((game['blue_sum'] * 100) / allBank) / 100).toFixed(2);
  }

  const red_tickets = parseFloat(red) * 1000;
  const blue_tickets = parseFloat(blue) * 1000 + 1;

  const randomTicket = await Game.randomInteger();
  const winTicket = randomTicket.json.data[0];

  let won = 0;
  let winColor = '';
  if (winTicket <= red_tickets) {
    winColor = 'red';
    coef = red;
    won = 0;
  } else {
    winColor = 'blue';
    coef = blue;
    won = 1;
  }

  io.sockets.emit('game.slider', {
    json: randomTicket.json,
    signature: randomTicket.signature,
    number: winTicket,
    won: won,
    id: game['id']
  });

  setTimeout( () => {
    Mysql.Query(`UPDATE game SET status = 3, win_ticket = ${winTicket}, json = '${JSON.stringify(randomTicket.json)}', signature = '${randomTicket.signature}', won = ${won} WHERE id = ${game['id']}`);
    Game.setWinners(game['id'], winColor, coef);
    Game.newGame();
    time = 0;
  }, 6000);
};

Game.setWinners = async (gameID, color, coef) => {
  const bets = await Mysql.Query(`SELECT * FROM bets WHERE game_id = ${gameID} AND color = '${color}' ORDER BY sum DESC`);
  coef = (100 / (parseFloat(coef) * 100)).toFixed(2);
  if (!isFinite(coef)) coef = 100.00;
  for (bet of bets) {
    const user = await Mysql.Query(`SELECT * FROM users WHERE id = ${bet['user_id']}`);
    const balance = parseFloat(user[0]['balance']) + parseFloat((bet['sum'] * coef) * 0.90);
    await Mysql.Query(`UPDATE users SET balance = ${balance} WHERE id = ${user[0]['id']}`);
    const newBalance = await User.getBalance(user[0]['id']);
    io.sockets.emit('user.updateBalance', {
      id: user[0]['id'],
      balance: newBalance
    });
  }
};

Game.bet = async (user, data) => {

  const summa = data['sum'];
  const checkingRegExp = new RegExp(/^(\d){1,13}$/g);
  const out = summa.match(checkingRegExp) !== null;

  if(!out) return {status: false, message: 'Недостаточно средств на балансе', type: 'error'};
  if (parseFloat(data['sum']) >= 0.10) {
    const last = await getAsync(`bet_${user['id']}`);

    if (last === '1') return { status: false, message: 'Подождите чучуть...', type: 'error' };

    redisClient.set(`bet_${user['id']}`, '1', 'EX', 3);

    const balance = await User.getBalance(user['id']);
    let game = await Game.thisGame();

    if (balance < data['sum']) return {status: false, message: 'Недостаточно средств на балансе', type: 'error'};
    if (game['status'] >= 2) return {status: false, message: 'Игра уже началась!', type: 'error'};

    const myBet = await Mysql.Query(`SELECT * FROM bets WHERE game_id = ${game['id']} AND user_id = ${user['id']} ORDER BY sum DESC`);

    let allSum = 0;

    if (myBet.length > 0)
      for (const summ of myBet)
        allSum += parseFloat(summ['sum']);

    if (allSum + parseFloat(data['sum']) > Config.MaxBet)
      return { status: false, message: 'Максимум можно поставить '+Config.MaxBet+' руб.' };

    if (myBet.length > 0)
      if (myBet['0']['color'] !== data['color']) return {status: false, message: 'Нельзя ставить на два разных цвета!', type: 'error'};

    await User.updateBalance(user['id'], parseFloat(balance) - parseFloat(data['sum']));

    if (myBet.length === 0) {
      const set = {
        game_id: game['id'], user_id: user['id'], color: data['color'], sum: parseFloat(data['sum']), time: Date.now()
      };
      await Mysql.Query(`INSERT INTO bets SET ?`, set);
    } else {
      await Mysql.Query(`UPDATE bets SET sum = ${parseFloat(myBet[0]['sum']) + parseFloat(data['sum'])} WHERE game_id = ${game['id']} AND user_id = ${user['id']}`);
    }

    let blueSum = game['blue_sum'];
    let redSum = game['red_sum'];
    if (data['color'] === 'blue') {
      blueSum = parseFloat(game['blue_sum']) + parseFloat(data['sum']);
    } else if (data['color'] === 'red') {
      redSum = parseFloat(game['red_sum']) + parseFloat(data['sum']);
    }

    if (blueSum > 0 && redSum > 0 && game['status'] === 0) await Game.startTimer();

    await Mysql.Query(`UPDATE game SET blue_sum = ${blueSum}, red_sum = ${redSum} WHERE id = ${game['id']}`);
    game = await Game.thisGame();

    const betsRedSql = await Mysql.Query(`SELECT * FROM bets WHERE game_id = ${game['id']} AND color = 'red' ORDER BY sum DESC`);
    const betsBlueSql = await Mysql.Query(`SELECT * FROM bets WHERE game_id = ${game['id']} AND color = 'blue' ORDER BY sum DESC`);

    let red_list = "";
    let blue_list = "";
    if (betsRedSql.length > 0) {
      for (bet of betsRedSql) {
        const user = await Mysql.Query(`SELECT * FROM users WHERE id = ${bet['user_id']}`);
        red_list += '<div class=\"list-item flex\" style=\"justify-content: left;\"><div class=\"ava\" style=\"background-image: url(' + user[0]['avatar'] + ');\"></div><div class=\"name\">' + user[0]['username'] + '</div><div class=\"sum\">' + bet['sum'] + '</div></div>';
      }
    }
    if (betsBlueSql.length > 0) {
      for (bet of betsBlueSql) {
        const user = await Mysql.Query(`SELECT * FROM users WHERE id = ${bet['user_id']}`);
        blue_list += '<div class=\"list-item flex\" style=\"justify-content: left;\"><div class=\"ava\" style=\"background-image: url(' + user[0]['avatar'] + ');\"></div><div class=\"name\">' + user[0]['username'] + '</div><div class=\"sum\">' + bet['sum'] + '</div></div>';
      }
    }

    let red = 0;
    let blue = 0;

    if (game['red_sum'] > 0 && game['blue_sum'] > 0) {
      const allBank = game['red_sum'] + game['blue_sum'];
      red = (((game['red_sum'] * 100) / allBank) / 100).toFixed(2);
      blue = (((game['blue_sum'] * 100) / allBank) / 100).toFixed(2);
    }

    return {
      'status': true,
      'red': red,
      'blue': blue,
      'red_list': red_list,
      'blue_list': blue_list,
      'red_sum': game['red_sum'],
      'blue_sum': game['blue_sum']
    };
  } else {
    return {status: false, message: 'Минимальная сумма ставки 0.1', type: 'error'};
  }
};

Game.setIo = async (socket) => {
  io = socket;
};

Game.randomInteger = async () => {
  const randomBilet = await Random.generateSignedIntegers({min: 1, max: 1000, n: 1});

  return {
    json: randomBilet.random,
    signature: randomBilet.signature
  };
};

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

module.exports = Game;
