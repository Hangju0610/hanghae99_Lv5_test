CREATE TABLE `Users` (
  `userId` integer UNIQUE PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `email` varchar(255) UNIQUE NOT NULL,
  `nickname` varchar(255) UNIQUE NOT NULL,
  `password` varchar(255) NOT NULL
);

CREATE TABLE `Posts` (
  `postId` integer UNIQUE PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `userId` integer UNIQUE NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` varchar(255) NOT NULL,
  `createdAt` date,
  `updatedAt` date
);

CREATE TABLE `Comments` (
  `commentId` integer UNIQUE PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `postId` integer NOT NULL,
  `userId` integer NOT NULL,
  `comment` varchar(255) NOT NULL,
  `createdAt` date,
  `updatedAt` date
);

CREATE TABLE `Likes` (
  `postId` integer NOT NULL,
  `userId` integer NOT NULL,
  `createdAt` date,
  `updatedAt` date
);

CREATE TABLE `RefreshTokens` (
  `userId` integer UNIQUE PRIMARY KEY NOT NULL,
  `refreshToken` varchar(255) UNIQUE NOT NULL
);

ALTER TABLE `Posts` ADD FOREIGN KEY (`userId`) REFERENCES `Users` (`userId`);

ALTER TABLE `Comments` ADD FOREIGN KEY (`userId`) REFERENCES `Users` (`userId`);

ALTER TABLE `Comments` ADD FOREIGN KEY (`postId`) REFERENCES `Posts` (`postId`);

ALTER TABLE `Likes` ADD FOREIGN KEY (`userId`) REFERENCES `Users` (`userId`);

ALTER TABLE `Likes` ADD FOREIGN KEY (`postId`) REFERENCES `Posts` (`postId`);

ALTER TABLE `RefreshTokens` ADD FOREIGN KEY (`userId`) REFERENCES `Users` (`userId`);
