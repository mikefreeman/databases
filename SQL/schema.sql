CREATE DATABASE chat;

USE chat;

CREATE TABLE `messages` (
  `message_id` INT NOT NULL AUTO_INCREMENT,
  `user_name` VARCHAR(21),
  `message_text` VARCHAR(144),
  `room_name` VARCHAR(21),
  `time` DATETIME,
  PRIMARY KEY  (`message_id`)
);

CREATE TABLE `users` (
  `user_name` VARCHAR(21) NOT NULL,
  PRIMARY KEY  (`user_name`)
);

CREATE TABLE `rooms` (
  `room_name` VARCHAR(21) NOT NULL,
  PRIMARY KEY  (`room_name`)
);

CREATE TABLE `friends` (
  `user_name` VARCHAR(21),
  `friends_with` VARCHAR(21)
);

/* You can also create more tables, if you need them... */

/*  Execute this file from the command line by typing:
 *    mysql < schema.sql
 *  to create the database and the tables.*/
