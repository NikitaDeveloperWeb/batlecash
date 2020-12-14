const Server = require('../express/server.js');
const Mysql = require('../functions/mysql.js');
const Game = require('../models/game.js');
const Chat = require('../models/chat.js');
const User = require('../models/user.js');

const http = require('http')
    , server = http.createServer(Server.app),
    io = require("socket.io").listen(server);

server.listen(8080);

io.use((socket, next) => {
    Server.Session(socket.handshake, {}, next);
});

let online = 0;

io.on('connection', async (socket) => {
    const userPassport = socket.handshake.session.passport &&
        socket.handshake.session.passport.user;

    let user = null;

    online++;
    io.sockets.emit('online', online);

    if (userPassport !== undefined) {
        Mysql.Query(`SELECT * FROM users WHERE identificator = ${userPassport['id']}`, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                if (results[0]) {
                    user = results[0];
                    socket.emit('auth', {
                        auth: true,
                        user: user
                    });
                } else {
                    socket.emit('auth', {
                        auth: false
                    })
                }
            }
        });
    } else {
        socket.emit('auth', {
            auth: false
        })
    }

    await Game.setIo(io);

    socket.on('game.getLoad', async () => {
      const load = await Game.load();

      socket.emit('game.load', load);
    });

    socket.on('game.bet', async (data) => {
        const bet = await Game.bet(user, data);
        const balance = await User.getBalance(user['id']);

        if (bet['status']) {
            io.sockets.emit('game.newBet', bet);
        } else {
            notify(user['id'], bet['message'], 'error');
        }

        io.sockets.emit('user.updateBalance', {
            id: user['id'],
            balance: balance
        });
    });

    const chat = await Chat.load();

    socket.emit('chat.load', chat);

    socket.on('chat.sendMessage', async (message) => {
        const sendMessage = await Chat.sendMessage(user, message);

        if (sendMessage['status']) {
            io.sockets.emit('chat.newMessage', sendMessage);
        } else {
            notify(user['id'], sendMessage['message'], 'error');
        }
    });

    socket.on('chat.delete', async (id) => {
        const deleteMessage = await Chat.delete(user['id'], id);

        if (deleteMessage['status']) {
            const chat = await Chat.load();
            io.sockets.emit('chat.load', chat);

            notify(user['id'], deleteMessage['message'], 'success');
        } else {
            notify(user['id'], deleteMessage['message'], 'error');
        }
    });

    socket.on('chat.ban', async (id) => {
        const banUser = await Chat.ban(user['id'], id);

        if (!banUser['status']) {
            notify(user['id'], banUser['message'], 'error');
        } else {
            notify(user['id'], banUser['message'], 'success');
        }
    });

    socket.on('user.deposit', async (sum) => {
        const payment = await User.deposit(user['id'], sum);

        if (payment['status']) {
          socket.emit('user.checkDeposit', payment['url']);
        } else {
            notify(user['id'], payment['message'], 'error');
        }
    });

    socket.on('user.loadDeposits', async () => {
        const loadDeposits = await User.loadDeposits(user['id']);

        socket.emit('user.loadDeposit', loadDeposits);
    });

    socket.on('user.withdraw', async (data) => {
      const withdraw = await User.withdraw(user['id'], data);

      if (withdraw.status) {
        notify(user['id'], withdraw.message, 'success');
      } else {
        notify(user['id'], withdraw.message, 'error');
      }
    });

    socket.on('user.loadWithdraws', async () => {
        const loadWithdraw = await User.loadWithdraws(user['id']);

        socket.emit('user.loadWithdraw', loadWithdraw);
    });

    socket.on('user.promoUse', async (data) => {
      const promoUse = await User.promoUse(user['id'], data);

      if (promoUse['status']) {
        notify(user['id'], promoUse['message'], 'success');
      } else {
        notify(user['id'], promoUse['message'], 'error');
      }
    });

    socket.on('user.createPromo', async (data) => {
        const createPromo = await User.createPromo(user['id'], data);

      if (createPromo['status']) {
        notify(user['id'], createPromo['message'], 'success');
      } else {
        notify(user['id'], createPromo['message'], 'error');
      }
    });

    socket.on('user.getBalance', async () => {
        const balance = await User.getBalance(user['id']);

        return socket.emit('user.updateBalance', {
          id: user['id'],
          balance: balance
        });
    });

    socket.on('user.loadReferrals', async () => {
        const referrals = await User.loadReferrals(user['id']);

        socket.emit('user.loadReferral', referrals);
    });

    socket.on('user.loadDaily', async () => {
        const dailyBonus = await User.dailyBonus(user['id']);

        if (dailyBonus['status']) {
          if (dailyBonus['show']) {
            socket.emit('user.daily', {
              show: true,
              message: dailyBonus['message']
            });
          } else {
            socket.emit('user.daily', {
              show: false
            })
          }
        } else {
          notify(user['id'], dailyBonus['message'], 'error');
        }
    });

    socket.on('user.dailyBonus', async () => {
      const dailyBonus = await User.getDailyBonus(user['id']);

      if (dailyBonus['status']) {
        notify(user['id'], dailyBonus['message'], 'success');
      } else {
        notify(user['id'], dailyBonus['message'], 'error');
      }
    });

    socket.on('user.loadProfile', async () => {
      const profile = await User.getProfile(user['id']);

      socket.emit('user.profile', profile);
    });

    socket.on('disconnect', () => {
        online--;
        io.sockets.emit('online', online);
    });

    const notify = (userID, message, type) => {
        socket.emit('user.notify', {
            id: userID,
            type: type,
            message: message
        });
    };
});

const Socket = {};

module.exports = Socket;
