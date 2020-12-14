const Mysql = require('../functions/mysql.js');
const strftime = require('strftime');
const requestify = require('requestify');
const Config = require('../variables/config.js');
const md5 = require('md5');
const sha256 = require('sha256');
const Base64 = require('js-base64').Base64;
const rp = require('request-promise');
const querystring = require('querystring');

const User = {};

User.getBalance = async (userID) => {
    const sql = await Mysql.Query(`SELECT * FROM users WHERE id = ${userID}`);
    return sql[0]['balance'];
};

User.updateBalance = async (userID, balance) => {
    const sql = Mysql.Query(`UPDATE users SET balance = ${balance} WHERE id = ${userID}`);
};

User.getUser = async (userID) => {
    const sql = await Mysql.Query(`SELECT * FROM users WHERE id = ${userID}`);
    return sql[0];
};

User.deposit = async (userID, sum) => {
    const user = await User.getUser(userID);

    if (parseFloat(sum) < Config.MinDeposit) return {status: false, message: 'Минимальная сумма пополнения '+Config.MinDeposit+' руб.'};

    const newPayment = await Mysql.Query(`INSERT INTO payments SET user_id = ${user['id']}, sum = ${parseFloat(sum)}, time = ${Date.now()}`);

    const m = Config.fk.id;
    const oa = parseFloat(sum);
    const o = newPayment['insertId'];
    const s = md5(`${m}:${oa}:${Config.fk.secret}:${o}`);

    return {
        status: true,
        url: `http://www.free-kassa.ru/merchant/cash.php?m=${m}&oa=${oa}&o=${o}&s=${s}`
    };
};

const number_format = (number, decimals, dec_point, thousands_sep) => {
    let i, j, kw, kd, km;
    // input sanitation & defaults
    if (isNaN(decimals = Math.abs(decimals))) {
        decimals = 2;
    }
    if (dec_point === undefined) {
        dec_point = ",";
    }
    if (thousands_sep === undefined) {
        thousands_sep = ".";
    }
    i = parseInt(number = (+number || 0).toFixed(decimals)) + "";
    if ((j = i.length) > 3) {
        j = j % 3;
    } else {
        j = 0;
    }
    km = (j ? i.substr(0, j) + thousands_sep : "");
    kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
    kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");
    return km + kw + kd;
};

const strtoupper = (str) => {
    return str.toUpperCase();
};

User.loadDeposits = async (userID) => {
    const user = await User.getUser(userID);

    const payments = await Mysql.Query(`SELECT * FROM payments WHERE user_id = ${user['id']} AND status = 1 ORDER BY time DESC LIMIT 20`);

    let returns = [];

    const strftimeIT = strftime.timezone(180);
    for (const payment of payments) {
        const date = strftimeIT('%d.%m.%y', new Date(parseInt(payment['time'])));
        returns.push({
            sum: payment['sum'],
            date: date
        });
    }

    return returns;
};

User.withdraw = async (userID, data) => {
    const user = await User.getUser(userID);
    const sum = parseFloat(data.sum);
    const phone = data.phone;
    const method = parseInt(data.method);

    let ps = 0;

    if (method < 1 && method > 10) return {status: false, message: 'Неизвестная ошибка'};

    if (phone.length < 8) return {status: false, message: 'Введите кошелек'};

    if (sum < Config.MinWithdraw) return {status: false, message: 'Минимальная сумма вывода '+Config.MinWithdraw+' руб.'};

    if (user['balance'] < sum) return {status: false, message: 'Недостаточно средств на балансе'};

    if ((method === 9 || method === 10) && sum < Config.MinWithdrawCard) return {
        status: false,
        message: 'Минимальная сумма вывода '+Config.MinWithdrawCard+' руб.'
    };

    const payments = await Mysql.Query(`SELECT * FROM withdraw WHERE user_id = ${user['id']} ORDER BY id DESC`);

    switch (method) {
        case 1:
            ps = 57378077;
            break;
        case 2:
            ps = 1136053;
            break;
        case 4:
            ps = 26808;
            break;
        case 5:
            ps = 24898938;
            break;
        case 6:
            ps = 24899391;
            break;
        case 7:
            ps = 24899291;
            break;
        case 8:
            ps = 95877310;
            break;
        case 9:
            ps = 117146509;
            break;
        case 10:
            ps = 117650874;
            break;
    }

    const request = await rp({
        method: 'POST',
        uri: 'https://payeer.com/ajax/api/api.php',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: querystring.stringify({
            account: Config.payeer_withdraw.account,
            apiId: Config.payeer_withdraw.apiId,
            apiPass: Config.payeer_withdraw.apiPass,
            action: 'output',
            ps: ps,
            sumOut: parseFloat(sum * 0.95).toFixed(2),
            curIn: 'RUB',
            curOut: 'RUB',
            param_ACCOUNT_NUMBER: phone
        }),
        json: true
    });

    if (request['errors'] !== null) {
        if (typeof request['errors']['sum_less_min'] !== "undefined") return {
            status: false,
            message: 'Введите другую сумму больше этой'
        };
        if (typeof request['errors']['sum_more_max'] !== "undefined") return {
            status: false,
            message: 'Введите другую сумму меньше этой'
        };
        if (typeof request['errors']['invalid format'] !== "undefined") return {
            status: false,
            message: 'Введите другой номер'
        };
        return {status: false, message: 'На данный момент банк сайта - пуст, попробуйте позже'};
    } else {
        await User.updateBalance(user['id'], parseFloat(user['balance'] - sum));
        await Mysql.Query(`INSERT INTO withdraw SET user_id = ${user['id']}, sum = ${parseFloat(sum * 0.95).toFixed(2)}, phone = '${phone}', method = ${method}, time = ${Date.now()}, historyId = ${request['historyId']}`);
        return {status: true, message: 'Заявка на вывод создана'};
    }
};

User.loadWithdraws = async (userID) => {
    const user = await User.getUser(userID);

    const withdraws = await Mysql.Query(`SELECT * FROM withdraw WHERE user_id = ${user['id']} ORDER BY time DESC LIMIT 20`);

    const retWithdraws = [];

    const strftimeIT = strftime.timezone(180);

    for (const withdraw of withdraws) {
        const date = strftimeIT('%d.%m.%y', new Date(parseInt(withdraw['time'])));
        retWithdraws.push({
            id: withdraw['id'],
            sum: withdraw['sum'],
            date: date,
            phone: withdraw['phone'],
            status: withdraw['status']

        });
    }

    return retWithdraws;
};

User.promoUse = async (userID, data) => {
    const user = await User.getUser(userID);

    const promo = data['promo'];

    const request = await rp({
        method: 'POST',
        uri: 'https://www.google.com/recaptcha/api/siteverify',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: querystring.stringify({
            secret: Config.google_Secret,
            response: data['recaptcha_response']
        }),
        json: true
    });

    if (promo.length < 3) return {status: false, message: 'Введите промокод'};

    if (user['provider'] === 'vkontakte') {
        const isMember = await requestify.post(`https://api.vk.com/method/groups.isMember?group_id=${Config.groupID}&user_id=${user['identificator']}&access_token=${Config.groupToken}&v=5.92`);
        if (!JSON.parse(isMember.body)['response']) return {status: false, message: 'Подпишитесь на группу'};
    }

    const checkReferralCode = await Mysql.Query(`SELECT * FROM users WHERE promocode = '${promo}'`);

    if (checkReferralCode[0]) {
        if (checkReferralCode[0]['id'] === user['id']) return {
            status: false,
            message: 'Нельзя активировать свой промокод'
        };
        if (parseInt(user['use_promocode']) !== 0) return {
            status: false,
            message: 'Вы уже активировали промокод данного типа'
        };
        if (user['use_promocode'] === promo) return {status: false, message: 'Вы уже активировали этот промокод'};

        await Mysql.Query(`UPDATE users SET use_promocode = '${promo}', balance = ${parseFloat(user['balance']) + 1} WHERE id = ${user['id']}`);
        await User.updateBalance(checkReferralCode[0]['id'], parseFloat(checkReferralCode[0]['balance']) + 1);

        return {status: true, message: 'Вы активировали промокод'};

    } else {

        const promoCode = await Mysql.Query(`SELECT * FROM promocode WHERE name = '${promo}'`);

        if (promoCode[0]) {
            const usesPromocode = await Mysql.Query(`SELECT * FROM promocodes_use WHERE user_id = ${user['id']} AND promo_id = ${promoCode[0]['id']}`);

            if (usesPromocode[0]) return {status: false, message: 'Промокод уже использован вами'};
            if (parseInt(promoCode[0]['uses']) <= 0) return {status: false, message: 'Промокод закончился'};
            if (parseInt(promoCode[0]['user_id']) === parseInt(user['id'])) return {
                status: false,
                message: 'Нельзя активировать свой промокод'
            };

            await User.updateBalance(user['id'], parseFloat(user['balance'] + parseFloat(promoCode[0]['sum'])));
            await Mysql.Query(`UPDATE promocode SET uses = ${parseInt(promoCode[0]['uses']) - 1} WHERE id = ${promoCode[0]['id']}`);
            await Mysql.Query(`INSERT INTO promocodes_use SET user_id = ${user['id']}, promo_id = ${promoCode[0]['id']}, time = ${Date.now()}`);

            return {status: true, message: 'Вы активировали промокод'};

        } else {
            return {status: false, message: 'Промокод не найден'};
        }
    }
};

User.createPromo = async (userID, promo) => {
    const user = await User.getUser(userID);

    if (promo['name'].length < 3 || promo['name'].length > 10) return {
        status: false,
        message: 'Промокод должен состоять от 3 до 10 символов'
    };

    if (parseFloat(promo['val']) <= 0) return {status: false, message: 'Введите награду'};
    if (parseInt(promo['use']) <= 0) return {status: false, message: 'Введите кол-во'}

    const usesPromocode = await Mysql.Query(`SELECT * FROM promocode WHERE name = '${promo['name']}'`);

    if (usesPromocode.length > 0) return {status: false, message: 'Данный промокод уже существует'};

    const sum = parseFloat(promo['val']) * parseInt(promo['use']);

    if (parseFloat(user['balance']) < sum) return {status: false, message: 'Не достаточно средств на балансе'};

    await Mysql.Query(`INSERT INTO promocode SET user_id = ${user['id']}, name = '${promo['name']}', sum = ${promo['val']}, uses = ${promo['use']}, time = ${Date.now()}`);
    await User.updateBalance(user['id'], parseFloat(user['balance']) - sum);

    return {status: true, message: 'Промокод создан'};
};

User.loadReferrals = async (userID) => {
    const user = await User.getUser(userID);

    const referrals = await Mysql.Query(`SELECT * FROM users WHERE use_promocode = 'C0${user['id']}'`);

    return referrals.length;
};

User.dailyBonus = async (userID) => {
    const user = await User.getUser(userID);

    if (parseInt(user['dailyBonus']) > parseInt(Date.now())) {
        const strftimeIT = strftime.timezone(180);
        const date = strftimeIT('%H:%M:%S %d.%m.%y', new Date(parseInt(user['dailyBonus'])));
        return {
            status: true,
            show: true,
            message: `<h5 id="bonustext" style="color: rgb(209, 52, 91); text-align: center;"><i class="fas fa-lock icon"></i>Бонус будет доступен в ${date}</h5>`
        };
    }

    return {status: true, show: false}
};

User.getDailyBonus = async (userID) => {

    const user = await User.getUser(userID);

    if (parseInt(user['dailyBonus']) > parseInt(Date.now())) {
        const strftimeIT = strftime.timezone(180);
        const date = strftimeIT('%H:%M:%S %d.%m.%y', new Date(parseInt(user['dailyBonus'])));
        return {status: false, message: `Бонус будет доступен ${date}`};
    }

    if (user['provider'] === 'vkontakte') {
        const isMember = await requestify.post(`https://api.vk.com/method/groups.isMember?group_id=${Config.groupID}&user_id=${user['identificator']}&access_token=${Config.groupToken}&v=5.92`);
        if (!JSON.parse(isMember.body)['response']) return {status: false, message: 'Подпишитесь на группу'};
    }

    let sum = 0.1;

    if (user['status'] === 1) sum = 1;
    if (user['status'] === 2) sum = 5;

    await Mysql.Query(`UPDATE users SET balance = ${parseFloat(user['balance'] + parseFloat(sum))}, dailyBonus = ${Date.now() + (24 * 60 * 60 * 1000)} WHERE id = ${user['id']}`);

    return {status: true, message: `Вы получили бонус ${sum} руб.`};
};

User.getProfile = async (userID) => {
    const user = await User.getUser(userID);

    const bets = await Mysql.Query(`SELECT * FROM bets WHERE user_id = ${user['id']} ORDER BY id DESC LIMIT 20`);

    let historyBets = [];

    for (const bet of bets) {
        const game = await Mysql.Query(`SELECT * FROM game WHERE id = ${bet['game_id']}`);

        if (game[0]['status'] === 3) {
            let win = 0;
            let winSum = 0;

            if (game[0]['won'] === 0 && bet['color'] === 'red') win = 1;
            if (game[0]['won'] === 1 && bet['color'] === 'blue') win = 1;

            let red = 0;
            let blue = 0;
            let coef = 0;

            if (win === 1) {
                if (game[0]['red_sum'] > 0 && game[0]['blue_sum'] > 0) {
                    const allBank = game[0]['red_sum'] + game[0]['blue_sum'];
                    red = (((game[0]['red_sum'] * 100) / allBank) / 100).toFixed(2);
                    blue = (((game[0]['blue_sum'] * 100) / allBank) / 100).toFixed(2);
                }
                if (game[0]['won'] === 0) {
                    coef = red;
                } else {
                    coef = blue;
                }
                coef = (100 / (parseFloat(coef) * 100)).toFixed(2);
                if (!isFinite(coef)) coef = 100.00;
                let winsSum = parseFloat(parseFloat((bet['sum'] * coef) * 0.90).toFixed(2) - parseFloat(bet['sum']).toFixed(2)).toFixed(2);
                if (winsSum < 0) {
                    win = 0;
                    winSum = `-${Math.abs(winsSum)}`;
                } else {
                    winSum = `+${winsSum}`;
                }
            } else {
                winSum = `-${parseFloat(bet['sum']).toFixed(2)}`;
            }

            historyBets.push({
                id: game[0]['id'],
                sum: parseFloat(bet['sum']).toFixed(2),
                betColor: bet['color'],
                colorWin: game[0]['won'],
                win: win,
                winSum: winSum
            });
        }
    }

    return {historyBets: historyBets}
};

User.checksWithdraws = () => {
    const checker = setInterval(async () => {
        const withdraws = await Mysql.Query(`SELECT * FROM withdraw WHERE status = 0 AND historyId > 0`);

        for (const withdraw of withdraws) {
            const user = User.getUser(withdraw['user_id']);
            const request = await rp({
                method: 'POST',
                uri: 'https://payeer.com/ajax/api/api.php',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: querystring.stringify({
                    account: Config.payeer_withdraw.account,
                    apiId: Config.payeer_withdraw.apiId,
                    apiPass: Config.payeer_withdraw.apiPass,
                    action: 'historyInfo',
                    historyId: withdraw['historyId']
                }),
                json: true
            });

            if (request['info']['status'] === 'cancel') {
                await Mysql.Query(`UPDATE withdraw SET status = 2 WHERE id = ${withdraw['id']}`);
                await User.updateBalance(user['id'], parseFloat(user['balance'] + withdraw['sum']));
            }
            if (request['info']['status'] === 'execute') await Mysql.Query(`UPDATE withdraw SET status = 1 WHERE id = ${withdraw['id']}`);
        }
    }, 30000);
};

module.exports = User;
