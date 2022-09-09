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

 Date: 09/09/2022 20:52:41
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
  `date` date DEFAULT NULL COMMENT 'ngày đặt lịch',
  `schedule_id` int(11) DEFAULT NULL COMMENT 'mapping với bảng schedule',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of booking
-- ----------------------------
BEGIN;
INSERT INTO `booking` (`id`, `doctor_id`, `customer_phone`, `customer_email`, `customer_name`, `shift`, `status`, `date`, `schedule_id`) VALUES (1, 1, '0168259116', 'tuandao864@gmail.com', 'John bosst', 2, 2, '2022-09-02', NULL);
INSERT INTO `booking` (`id`, `doctor_id`, `customer_phone`, `customer_email`, `customer_name`, `shift`, `status`, `date`, `schedule_id`) VALUES (2, 1, '0168259116', 'tuandao864@gmail.com', 'John bosst', 1, 2, '2022-09-02', NULL);
COMMIT;

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of doctor
-- ----------------------------
BEGIN;
INSERT INTO `doctor` (`id`, `name`, `email`, `phone`, `status`, `password`) VALUES (1, 'kayla@example.com', '0', '0', 2, '0');
INSERT INTO `doctor` (`id`, `name`, `email`, `phone`, `status`, `password`) VALUES (2, 'John bosst', 'tuandao864@gmail.com', '0168259116', 2, '123456789');
COMMIT;

-- ----------------------------
-- Table structure for schedule
-- ----------------------------
DROP TABLE IF EXISTS `schedule`;
CREATE TABLE `schedule` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'id tự tăng',
  `doctor_id` int(11) NOT NULL COMMENT 'tham chiếu doctor.id',
  `shift` int(11) NOT NULL COMMENT 'ca làm: 1-morning, 2-afternoon, 3-fulltime',
  `date` date NOT NULL COMMENT 'ngày làm',
  `booked` int(11) DEFAULT 0 COMMENT 'đã được book: 0- chưa có, 1-morning, 2-afternoon, 3-fulltime',
  `status` int(11) DEFAULT 2 COMMENT 'trạng thái: 1-ẩn, 2-hiện',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of schedule
-- ----------------------------
BEGIN;
INSERT INTO `schedule` (`id`, `doctor_id`, `shift`, `date`, `booked`, `status`) VALUES (1, 1, 3, '2022-09-02', 3, 2);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
