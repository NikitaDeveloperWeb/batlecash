const Config = {
  nameSite: 'вашдоментипотут.RU', //домен
  urlSite: 'http://вашдоментипотут.ru', //Ссылка на сайт
  domainFrontend: 'вашдоментипотут.RU', //домен
  domainBackend: 'вашдоментипотут.RU:3000', // домен, :3000 не убирать
  MaxBet: '100', // Максимальная ставка
  MinDeposit: '2', // Минимальная сумма пополнения
  MinWithdraw: '5', // Минимальная сумма вывода
  MinWithdrawCard: '', // Минимальная сумма вывода Карты
  ApiRandomORG: '4378aace-b39a-4088-a1d3-ecdf65519236', // Api ключ RandomORG
  google_Secret: '6Ld0XFQUAAAAAEmo8ghuXwG5s_Au0wMux0C77jvu', //ключ Google Captcha
  groupID: '175286164', //ID группы вк
  groupToken: '442179f82c382cf878e4b62c990f416098056649eb3add6fa7cc216a2fa5f75749530e1c95884a81e80d1', //Токен группы вк
  //База
  bd: {
    server: 'localhost', //не трогать
    username: 'root', //не трогать
    password: 'вашпарольотбазытиптут', //пароль
    table: '12345677899' //Имя базы
  },
  //Авторизация ВК
  vk: {
    id: '6610169', //id vk
    secret: '25tTzf4LoUfHX0To3n0s', //секретка vk
  },
  //Авторизация Одноклассники
  ok: {
    id: '1', //id ok
    secret: '2', //секретка ok
    public: '3', //паблик ok
  },
  //Настройки Фрикассы {Оповещение:} [http://Вашдомен.ru:3000/payment/check] {POST} и {Успех/Неудача:} [http://Вашдомен.ru:3000/] {GET}
  fk: {
    id: '153', //id freekassa
    secret: 'dc43d0ac', //секретка1 freekassa
    secret2: 'd7a78582' //секретка 2 freekassa
  },
  //Автовывод и История выводов
  payeer_withdraw: {
  account: 'P1008799213', //Номер счета Payeer
  apiId: '720917692', //Api Payeer
  apiPass: '4lmzDMsQ7cblKHqX' //Api Ключ Payeer
  }
};

module.exports = Config;
