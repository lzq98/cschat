--
-- Database: `cschat`
--

-- --------------------------------------------------------

--
-- Table structure for table `chat`
--

CREATE TABLE `chat` (
  `chatid` bigint UNSIGNED NOT NULL,
  `relationid` int NOT NULL,
  `time` bigint UNSIGNED NOT NULL,
  `type` int NOT NULL,
  `sender` varchar(5000) NOT NULL,
  `receiver` varchar(5000) NOT NULL
);

-- --------------------------------------------------------

--
-- Table structure for table `friends`
--

CREATE TABLE `friends` (
  `relationid` int NOT NULL,
  `sender` int NOT NULL,
  `receiver` int NOT NULL,
  `isfriend` tinyint(1) NOT NULL DEFAULT '0',
  `sunread` int UNSIGNED NOT NULL DEFAULT '0',
  `runread` int UNSIGNED NOT NULL DEFAULT '0',
  `time` bigint NOT NULL,
  `message` bigint UNSIGNED DEFAULT NULL
);

-- --------------------------------------------------------

--
-- Table structure for table `unread`
--

CREATE TABLE `unread` (
  `relationid` int NOT NULL,
  `receiverid` int NOT NULL,
  `count` int UNSIGNED NOT NULL
);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `uid` int NOT NULL,
  `password` varchar(64) NOT NULL,
  `uname` varchar(50) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `avatar` varchar(40) DEFAULT NULL,
  `publicKey` varchar(172) NOT NULL
);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`chatid`),
  ADD KEY `relationid` (`relationid`);

--
-- Indexes for table `friends`
--
ALTER TABLE `friends`
  ADD PRIMARY KEY (`relationid`),
  ADD KEY `sender` (`sender`),
  ADD KEY `receiver` (`receiver`),
  ADD KEY `LastMessageExist` (`message`);

--
-- Indexes for table `unread`
--
ALTER TABLE `unread`
  ADD KEY `unreadValidReceiver` (`receiverid`),
  ADD KEY `relationid` (`relationid`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`uid`),
  ADD KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chat`
--
ALTER TABLE `chat`
  MODIFY `chatid` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `friends`
--
ALTER TABLE `friends`
  MODIFY `relationid` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `uid` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `chat`
--
ALTER TABLE `chat`
  ADD CONSTRAINT `chatIsfriend` FOREIGN KEY (`relationid`) REFERENCES `friends` (`relationid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `friends`
--
ALTER TABLE `friends`
  ADD CONSTRAINT `friendsValidReceiver` FOREIGN KEY (`receiver`) REFERENCES `user` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `friendsValidSender` FOREIGN KEY (`sender`) REFERENCES `user` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `LastMessageExist` FOREIGN KEY (`message`) REFERENCES `chat` (`chatid`) ON DELETE SET NULL;

--
-- Constraints for table `unread`
--
ALTER TABLE `unread`
  ADD CONSTRAINT `unreadValidReceiver` FOREIGN KEY (`receiverid`) REFERENCES `user` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `unreadValidRelation` FOREIGN KEY (`relationid`) REFERENCES `friends` (`relationid`) ON DELETE CASCADE ON UPDATE CASCADE;

