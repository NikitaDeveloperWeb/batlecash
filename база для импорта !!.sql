-- Adminer 4.3.1 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `bets`;
CREATE TABLE `bets` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `game_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL,
  `blue_sum` double(20,2) DEFAULT '0.00',
  `red_sum` double(20,2) DEFAULT '0.00',
  `sum` double(20,2) DEFAULT '0.00',
  `price` double(20,2) DEFAULT '0.00',
  `win` double(20,2) DEFAULT '0.00',
  `color` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `bets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `bets` (`id`, `game_id`, `user_id`, `time`, `blue_sum`, `red_sum`, `sum`, `price`, `win`, `color`, `created_at`, `updated_at`) VALUES
(1,	5,	15,	'1565420439007',	0.00,	0.00,	34.00,	0.00,	0.00,	'red',	'2019-08-10 07:00:55',	NULL);

DROP TABLE IF EXISTS `bonus`;
CREATE TABLE `bonus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `bonus` double(20,2) DEFAULT NULL,
  `remaining` text,
  `status` int(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `chat`;
CREATE TABLE `chat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `time` text,
  `message` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `chat` (`id`, `user_id`, `time`, `message`) VALUES
(22,	15,	'1565420434794',	'saul');

DROP TABLE IF EXISTS `chat1`;
CREATE TABLE `chat1` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `time` varchar(255) NOT NULL,
  `message` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `game`;
CREATE TABLE `game` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `price` double(20,2) DEFAULT '0.00',
  `commission` double(20,2) DEFAULT '0.00',
  `winner_team` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `blue_sum` double(20,2) DEFAULT '0.00',
  `NaN` double(20,2) DEFAULT '0.00',
  `red_sum` double(20,2) DEFAULT '0.00',
  `json` longtext,
  `win_ticket` varchar(64) DEFAULT '0',
  `red_tickets` varchar(64) DEFAULT '1-500',
  `blue_tickets` varchar(64) DEFAULT '501-100',
  `win_factor` double(20,2) DEFAULT '0.00',
  `red_factor` double(20,2) DEFAULT '0.00',
  `blue_factor` double(20,2) DEFAULT '0.00',
  `won` tinyint(1) DEFAULT '0',
  `rand_number` varchar(255) DEFAULT '0',
  `signature` text,
  `random` text,
  `status` tinyint(1) DEFAULT '0',
  `time` varchar(255) DEFAULT '0',
  `finished_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `game` (`id`, `price`, `commission`, `winner_team`, `color`, `blue_sum`, `NaN`, `red_sum`, `json`, `win_ticket`, `red_tickets`, `blue_tickets`, `win_factor`, `red_factor`, `blue_factor`, `won`, `rand_number`, `signature`, `random`, `status`, `time`, `finished_at`, `created_at`, `updated_at`) VALUES
(5,	0.00,	0.00,	NULL,	NULL,	0.00,	0.00,	34.00,	NULL,	'0',	'1-500',	'501-100',	0.00,	0.00,	0.00,	0,	'0',	NULL,	NULL,	0,	'0',	NULL,	NULL,	NULL);

DROP TABLE IF EXISTS `payments`;
CREATE TABLE `payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sum` double(20,2) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL,
  `date` varchar(255) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `SIGN` varchar(255) DEFAULT NULL,
  `status` int(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `payments` (`id`, `sum`, `time`, `date`, `user_id`, `SIGN`, `status`, `created_at`, `updated_at`) VALUES
(11,	2.00,	'1548335818392',	NULL,	'12',	NULL,	0,	'2019-01-24 13:16:58',	NULL),
(12,	2.00,	'1548335981399',	NULL,	'12',	NULL,	0,	'2019-01-24 13:30:42',	NULL),
(13,	2.00,	'1548336922725',	NULL,	'12',	NULL,	0,	'2019-01-24 13:35:22',	NULL),
(14,	2.00,	'1548336922913',	NULL,	'12',	NULL,	0,	'2019-01-24 13:35:22',	NULL),
(15,	2.00,	'1548336959802',	NULL,	'12',	NULL,	0,	'2019-01-24 13:35:59',	NULL),
(16,	2.00,	'1548337595432',	NULL,	'12',	NULL,	0,	'2019-01-24 13:46:35',	NULL),
(17,	2.00,	'1548337802014',	NULL,	'12',	NULL,	0,	'2019-01-24 13:50:02',	NULL),
(18,	2.00,	'1548337803449',	NULL,	'12',	NULL,	0,	'2019-01-24 13:50:03',	NULL),
(19,	2.00,	'1548337802944',	NULL,	'12',	NULL,	0,	'2019-01-24 13:50:03',	NULL),
(20,	2.00,	'1548337804817',	NULL,	'12',	NULL,	0,	'2019-01-24 13:50:05',	NULL),
(21,	2.00,	'1548337892284',	NULL,	'12',	NULL,	0,	'2019-01-24 13:51:32',	NULL),
(22,	2.00,	'1548339422809',	NULL,	'12',	NULL,	0,	'2019-01-24 14:17:02',	NULL),
(23,	2.00,	'1548339433208',	NULL,	'12',	NULL,	0,	'2019-01-24 14:17:13',	NULL),
(24,	2.00,	'1548340473112',	NULL,	'12',	NULL,	0,	'2019-01-24 14:34:33',	NULL),
(25,	2.00,	'1548340672910',	NULL,	'12',	NULL,	0,	'2019-01-24 14:37:52',	NULL),
(26,	2.00,	'1548341332012',	NULL,	'12',	NULL,	0,	'2019-01-24 14:48:52',	NULL),
(27,	2.00,	'1548341888387',	NULL,	'12',	NULL,	1,	'2019-01-24 14:58:49',	NULL),
(28,	2.00,	'1548343873084',	NULL,	'12',	NULL,	0,	'2019-01-24 15:31:13',	NULL),
(29,	2.00,	'1548343931771',	NULL,	'12',	NULL,	0,	'2019-01-24 15:32:11',	NULL),
(30,	2.00,	'1548343932254',	NULL,	'12',	NULL,	0,	'2019-01-24 15:32:12',	NULL),
(31,	2.00,	'1548346320927',	NULL,	'12',	NULL,	0,	'2019-01-24 16:12:00',	NULL);

DROP TABLE IF EXISTS `promocode`;
CREATE TABLE `promocode` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `use_promocode` varchar(255) DEFAULT NULL,
  `uses` int(11) NOT NULL DEFAULT '0',
  `time` varchar(255) DEFAULT NULL,
  `limit` int(11) DEFAULT NULL,
  `sum` double(20,2) NOT NULL DEFAULT '0.00',
  `amount` int(255) DEFAULT NULL,
  `count_use` int(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `promocode_user_id_foreign` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `promocodes_use`;
CREATE TABLE `promocodes_use` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `sum` double(20,2) DEFAULT '0.00',
  `promo_id` varchar(255) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '0',
  `time` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `promocodes_use_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `random_keys`;
CREATE TABLE `random_keys` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(255) DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  `bits_count` int(255) DEFAULT NULL,
  `status` int(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `settings`;
CREATE TABLE `settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `domainBackend` varchar(255) NOT NULL DEFAULT 'egoloto.ru',
  `domainFrontend` varchar(255) NOT NULL DEFAULT 'egoloto.ru:3000',
  `nameSite` varchar(255) NOT NULL DEFAULT 'egoloto.ru',
  `version` varchar(255) NOT NULL DEFAULT 'V 2.0',
  `vk_key` varchar(255) DEFAULT NULL,
  `vk_secret` varchar(255) DEFAULT NULL,
  `vk_url` varchar(255) DEFAULT NULL,
  `order_id` int(11) DEFAULT '1',
  `mrh_ID` int(11) DEFAULT NULL,
  `mrh_secret1` varchar(255) DEFAULT NULL,
  `mrh_secret2` varchar(255) DEFAULT NULL,
  `fk_api` varchar(255) DEFAULT NULL,
  `fk_wallet` varchar(255) DEFAULT NULL,
  `timer` int(11) NOT NULL DEFAULT '10',
  `min_bet` double(20,2) NOT NULL DEFAULT '0.10',
  `max_bet` double(20,2) NOT NULL DEFAULT '5000.00',
  `commission` int(11) NOT NULL DEFAULT '10',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `settings` (`id`, `domainBackend`, `domainFrontend`, `nameSite`, `version`, `vk_key`, `vk_secret`, `vk_url`, `order_id`, `mrh_ID`, `mrh_secret1`, `mrh_secret2`, `fk_api`, `fk_wallet`, `timer`, `min_bet`, `max_bet`, `commission`, `created_at`, `updated_at`) VALUES
(2,	'51.38.232.209',	'51.38.232.209:3000',	'51.38.232.209',	'vashdomain.com',	'7090398',	'20LohSW2Jgp672hFMVY5',	'',	1,	NULL,	NULL,	NULL,	NULL,	NULL,	10,	0.10,	5000.00,	10,	'2019-08-10 07:00:06',	NULL);

DROP TABLE IF EXISTS `success_pay`;
CREATE TABLE `success_pay` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user` varchar(255) DEFAULT NULL,
  `price` int(11) NOT NULL,
  `status` int(1) NOT NULL DEFAULT '0',
  `code` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `success_pay_user_id_foreign` (`user`),
  CONSTRAINT `success_pay_user_id_foreign` FOREIGN KEY (`user`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `username` varchar(255) NOT NULL,
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `avatar` text NOT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `dailyBonus` varchar(255) DEFAULT NULL,
  `identificator` varchar(255) NOT NULL,
  `balance` double(20,2) DEFAULT '0.00',
  `ip` double(2,2) DEFAULT '0.00',
  `status` int(11) NOT NULL DEFAULT '0',
  `chat` int(11) NOT NULL DEFAULT '0',
  `is_moder` int(11) DEFAULT '0',
  `is_youtuber` int(11) NOT NULL DEFAULT '0',
  `is_premium` tinyint(1) DEFAULT '0',
  `is_vip` tinyint(1) DEFAULT '0',
  `banchat` int(11) DEFAULT '0',
  `ban` int(1) NOT NULL DEFAULT '0',
  `affiliate_id` int(11) DEFAULT NULL,
  `referred_by` varchar(255) DEFAULT '0',
  `promocode` varchar(255) DEFAULT NULL,
  `use_promocode` varchar(255) DEFAULT '0',
  `provider` varchar(255) DEFAULT NULL,
  `access_token` text,
  `remember_token` text,
  `time` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `users` (`username`, `id`, `avatar`, `user_id`, `dailyBonus`, `identificator`, `balance`, `ip`, `status`, `chat`, `is_moder`, `is_youtuber`, `is_premium`, `is_vip`, `banchat`, `ban`, `affiliate_id`, `referred_by`, `promocode`, `use_promocode`, `provider`, `access_token`, `remember_token`, `time`, `created_at`, `updated_at`) VALUES
('Hi girls',	12,	'https://sun6-19.userapi.com/c851032/v851032853/488e2/HfeGPwLb8fU.jpg?ava=1',	NULL,	NULL,	'427761187',	0.00,	0.00,	0,	0,	0,	0,	0,	0,	0,	0,	NULL,	'0',	'C012',	'C023',	'vkontakte',	NULL,	NULL,	'1547968164875',	'2019-08-10 07:00:24',	NULL),
('Наиль Зайнуллин',	13,	'https://sun9-47.userapi.com/c834202/v834202535/127c74/1TvymFpRHSg.jpg?ava=1',	NULL,	NULL,	'382595211',	55555.00,	0.00,	4,	0,	0,	0,	1,	0,	0,	0,	NULL,	'0',	'C013',	'0',	'vkontakte',	NULL,	NULL,	'1565420086043',	'2019-08-10 06:57:56',	NULL),
('Наиль Зайнуллин',	15,	'https://sun9-47.userapi.com/c834202/v834202535/127c74/1TvymFpRHSg.jpg?ava=1',	NULL,	NULL,	'382595227',	55521.00,	0.00,	4,	0,	0,	0,	0,	0,	0,	0,	NULL,	'0',	'C015',	'0',	'vkontakte',	NULL,	NULL,	'1565420288529',	'2019-08-10 07:00:55',	NULL);

DROP TABLE IF EXISTS `withdraw`;
CREATE TABLE `withdraw` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `ps` varchar(255) DEFAULT '0',
  `sum` double(20,2) DEFAULT '0.00',
  `phone` varchar(255) DEFAULT NULL,
  `method` varchar(255) DEFAULT '0',
  `time` varchar(255) DEFAULT NULL,
  `historyId` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `withdraw_user_id_foreign` (`user_id`),
  CONSTRAINT `withdraw_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- 2019-08-10 07:07:30
