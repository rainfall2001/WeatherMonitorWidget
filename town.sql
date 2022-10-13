-- phpMyAdmin SQL Dump
-- version 4.9.7
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Mar 31, 2022 at 06:07 AM
-- Server version: 5.7.32
-- PHP Version: 7.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `322`
--

-- --------------------------------------------------------

--
-- Table structure for table `town`
--

CREATE TABLE `town` (
  `name` varchar(30) NOT NULL,
  `lon` float NOT NULL,
  `lat` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `town`
--

INSERT INTO `town` (`name`, `lon`, `lat`) VALUES
('Hamilton', 175.279, -37.787),
('Auckland', 174.763, -36.8485),
('Dunedin', 170.503, -45.8788),
('Christchurch', 172.638, -43.5308),
('Tauranga', 176.165, -37.6878),
('Wellington', 174.777, -41.2888);
