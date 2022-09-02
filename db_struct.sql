/*
 Navicat Premium Data Transfer

 Source Server         : php_course
 Source Server Type    : MariaDB
 Source Server Version : 100425 (10.4.25-MariaDB-1:10.4.25+maria~focal)
 Source Host           : localhost:3306
 Source Schema         : php_course

 Target Server Type    : MariaDB
 Target Server Version : 100425 (10.4.25-MariaDB-1:10.4.25+maria~focal)
 File Encoding         : 65001

 Date: 02/09/2022 20:29:50
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for booking
-- ----------------------------
DROP TABLE IF EXISTS `booking`;
CREATE TABLE `booking` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'id tự động tăng',
  `doctor_id` int(11) NOT NULL COMMENT 'id bác sĩ khám',
  `customer_phone` varchar(255) NOT NULL COMMENT 'SDT khách',
  `customer_email` varchar(255) NOT NULL COMMENT 'email khách',
  `customer_name` varchar(255) NOT NULL COMMENT 'tên khách hàng',
  `shift` int(11) NOT NULL COMMENT 'ca khám: 1-morning, 2-afternoon',
  `status` int(10) unsigned DEFAULT 2 COMMENT 'trạng thái: 1-ẩn, 2-hiện',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for doctor
-- ----------------------------
DROP TABLE IF EXISTS `doctor`;
CREATE TABLE `doctor` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT 'id tự động tăng',
  `name` varchar(255) NOT NULL COMMENT 'Tên bác sĩ',
  `email` varchar(255) NOT NULL COMMENT 'Email bác sĩ',
  `phone` varchar(15) NOT NULL COMMENT 'SDT',
  `status` int(11) DEFAULT 2 COMMENT 'trạng thái: 1-ẩn, 2-hiện',
  `password` varchar(255) NOT NULL COMMENT 'mật khẩu đăng nhập tài khoản',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Table structure for schedule
-- ----------------------------
DROP TABLE IF EXISTS `schedule`;
CREATE TABLE `schedule` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'id tự tăng',
  `doctor_id` int(11) NOT NULL COMMENT 'tham chiếu doctor.id',
  `shift` int(11) NOT NULL COMMENT 'ca làm: 1-morning, 2-afternoon, 3-fulltime',
  `date` int(11) NOT NULL COMMENT 'ngày làm, unix timestamp',
  `booked` int(11) DEFAULT NULL COMMENT 'đã được book: 0- chưa có, 1-morning, 2-afternoon, 3-fulltime',
  `status` int(11) DEFAULT 2 COMMENT 'trạng thái: 1-ẩn, 2-hiện',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

SET FOREIGN_KEY_CHECKS = 1;
