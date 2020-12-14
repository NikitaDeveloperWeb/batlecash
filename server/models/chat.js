const Mysql = require('../functions/mysql.js');
const User  = require('../models/user.js');
const redis = require('redis');

const redisClient = redis.createClient();

const {promisify} = require('util');
const getAsync = promisify(redisClient.get).bind(redisClient);

const Chat = {};

Chat.sendMessage = async (userID, message) => {
  const user = await User.getUser(userID['id']);

  const userLastMessage = await Mysql.Query(`SELECT * FROM chat WHERE user_id = ${user['id']} ORDER BY time DESC`);

  const lastMessage = await Mysql.Query(`SELECT * FROM chat ORDER BY time DESC`);

  const last = await getAsync(`lastMessage_${user['id']}`);

  if (last === '1') return { status: false, message: 'Не спамьте!' };

  redisClient.set(`lastMessage_${user['id']}`, '1', 'EX', 3);

  if (userLastMessage.length > 0)
    if (userLastMessage[0]['message'] === message) return { status: false, message: 'Не спамьте!' };

  if (lastMessage.length > 0)
    if (lastMessage[0]['message'] === message) return { status: false, message: 'Не спамьте!' };

  if (user['chat'] === 1) return { status: false, message: 'Вы заблокированы в чате' };

  const sql = {
    'user_id': user['id'],
    'message': message,
    'time': Date.now()
  };

  const insertMessage = await Mysql.Query(`INSERT INTO chat SET ?`, sql);
  const messageSql = await Mysql.Query(`SELECT * FROM chat WHERE id = ${insertMessage['insertId']}`);

  return {
    status: true,
    id: messageSql['id'],
    user: {
      avatar: user['avatar'],
      username: user['username'],
      identificator: user['identificator'],
      id: user['id'],
      status: user['status'],
      provider: user['provider']
    },
    message: message
  }
};

Chat.load = async () => {
  const chatSQL = await Mysql.Query(`SELECT * FROM chat ORDER BY id DESC LIMIT 20`);
  const chat = [];

  for (message of chatSQL) {
    const user = await Mysql.Query(`SELECT * FROM users WHERE id = ${message['user_id']}`);
    chat.push({
      id: message['id'],
      user: {
        avatar: user[0]['avatar'],
        username: user[0]['username'],
        identificator: user[0]['identificator'],
        id: user[0]['id'],
        status: user[0]['status'],
        provider: user[0]['provider']
      },
      message: message['message']
    });
  }

  return chat.reverse();
};

Chat.delete = async (userID, id) => {
  const user = await User.getUser(userID);

  if (user['status'] !== 4) return { status: false, message: 'Вы не администратор' };

  await Mysql.Query(`DELETE FROM chat WHERE id = ${id}`);

  return { status: true, message: 'Сообщение удалено' }
};

Chat.ban = async (userID, id) => {
    const user = await User.getUser(userID);

    if (user['status'] !== 4) return { status: false, message: 'Вы не администратор' };

    const banUser = await User.getUser(id);

    if (typeof banUser['chat'] === "undefined") return { status: false, message: 'Ошибка' };

    if (banUser['chat'] === 1)
    {
      await Mysql.Query(`UPDATE users SET chat = 0 WHERE id = ${id}`);
      return { status: true, message: 'Пользователь разблокирован в чате' }
    };

    await Mysql.Query(`UPDATE users SET chat = 1 WHERE id = ${id}`);

    return { status: true, message: 'Пользователь заблокирован в чате' }
};

module.exports = Chat;
