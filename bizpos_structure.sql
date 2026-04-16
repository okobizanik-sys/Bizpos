-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 16, 2026 at 08:38 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ganz-db`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `user_id` int(10) UNSIGNED NOT NULL,
  `type` varchar(255) NOT NULL,
  `provider` varchar(255) NOT NULL,
  `provider_account_id` varchar(255) NOT NULL,
  `refresh_token` varchar(255) DEFAULT NULL,
  `access_token` varchar(255) DEFAULT NULL,
  `expires_at` int(11) DEFAULT NULL,
  `token_type` varchar(255) DEFAULT NULL,
  `scope` varchar(255) DEFAULT NULL,
  `id_token` varchar(255) DEFAULT NULL,
  `session_state` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `barcode_serials`
--

CREATE TABLE `barcode_serials` (
  `id` int(10) UNSIGNED NOT NULL,
  `serial` bigint(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `barcode_serials`
--

INSERT INTO `barcode_serials` (`id`, `serial`, `created_at`, `updated_at`) VALUES
(14, 1, '2026-02-25 07:04:41', '2026-02-25 07:04:41'),
(15, 2, '2026-02-25 07:22:54', '2026-02-25 07:22:54');

-- --------------------------------------------------------

--
-- Table structure for table `branches`
--

CREATE TABLE `branches` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `root` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `branches`
--

INSERT INTO `branches` (`id`, `name`, `address`, `phone`, `root`, `created_at`, `updated_at`) VALUES
(1, 'Motijheel', 'Motijheel', '01521747442', 0, '2025-11-05 07:43:48', '2025-11-05 07:43:48'),
(2, 'Mohammadpur', 'Krishi Market', '01711000000', 0, '2025-11-05 12:04:21', '2025-11-05 12:04:21'),
(4, 'Mirpur', '213/1, 60 Feet Road, Monipur, Mirpur, Dhaka', '01973590937', 0, '2025-11-11 11:55:20', '2025-11-11 11:55:20'),
(5, 'Gazipur', 'Duet-Gazipur-Kashem_Villa', '01747874773', 0, '2025-12-11 08:06:28', '2025-12-11 08:06:28');

-- --------------------------------------------------------

--
-- Table structure for table `branches_users`
--

CREATE TABLE `branches_users` (
  `branch_id` int(10) UNSIGNED NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `branches_users`
--

INSERT INTO `branches_users` (`branch_id`, `user_id`) VALUES
(2, 8),
(2, 10),
(5, 9);

-- --------------------------------------------------------

--
-- Table structure for table `brands`
--

CREATE TABLE `brands` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `brands`
--

INSERT INTO `brands` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Honor', '2025-11-05 09:13:36', '2025-11-05 09:13:36'),
(2, 'Lexor', '2025-11-05 13:04:30', '2025-11-05 13:04:30'),
(3, 'TechCorp', '2025-12-11 06:55:53', '2025-12-11 06:55:53'),
(4, 'StyleMax', '2025-12-11 06:55:53', '2025-12-11 06:55:53'),
(5, 'HomeComfort', '2025-12-11 06:55:53', '2025-12-11 06:55:53'),
(6, 'SportPro', '2025-12-11 06:55:53', '2025-12-11 06:55:53'),
(7, 'MediaPub', '2025-12-11 06:55:53', '2025-12-11 06:55:53'),
(8, 'FreshEats', '2025-12-11 06:55:53', '2025-12-11 06:55:53'),
(9, 'BeautyPlus', '2025-12-11 06:55:53', '2025-12-11 06:55:53'),
(10, 'PlayZone', '2025-12-11 06:55:53', '2025-12-11 06:55:53'),
(11, 'Radhuni', '2026-04-05 05:57:17', '2026-04-05 05:57:17');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Tech Gadgets', '2025-11-05 09:13:27', '2025-11-05 09:13:27'),
(2, 'Men outfit', '2025-11-05 13:04:22', '2025-11-05 13:04:22'),
(3, 'Electronics', '2025-12-11 06:54:57', '2025-12-11 06:54:57'),
(4, 'Clothing', '2025-12-11 06:54:57', '2025-12-11 06:54:57'),
(5, 'Home & Garden', '2025-12-11 06:54:57', '2025-12-11 06:54:57'),
(6, 'Sports & Outdoors', '2025-12-11 06:54:57', '2025-12-11 06:54:57'),
(7, 'Books & Media', '2025-12-11 06:54:57', '2025-12-11 06:54:57'),
(8, 'Food & Beverages', '2025-12-11 06:54:57', '2025-12-11 06:54:57'),
(9, 'Health & Beauty', '2025-12-11 06:54:57', '2025-12-11 06:54:57'),
(10, 'Toys & Games', '2025-12-11 06:54:57', '2025-12-11 06:54:57');

-- --------------------------------------------------------

--
-- Table structure for table `challans`
--

CREATE TABLE `challans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `from_branch_id` int(10) UNSIGNED DEFAULT NULL,
  `to_branch_id` int(10) UNSIGNED DEFAULT NULL,
  `status` enum('PENDING','RECEIVED') DEFAULT 'PENDING',
  `quantity` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `challan_no` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `challans`
--

INSERT INTO `challans` (`id`, `from_branch_id`, `to_branch_id`, `status`, `quantity`, `created_at`, `updated_at`, `challan_no`) VALUES
(1, 1, 2, 'RECEIVED', 80, '2025-11-05 12:10:48', '2025-11-05 12:11:15', '051125-420'),
(2, 1, 4, 'RECEIVED', 15, '2025-12-11 07:46:27', '2025-12-11 07:46:45', '111225-790'),
(3, 2, 5, 'PENDING', 2, '2026-02-25 04:04:56', '2026-02-25 04:04:56', '250226-053');

-- --------------------------------------------------------

--
-- Table structure for table `challan_items`
--

CREATE TABLE `challan_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `challan_id` bigint(20) UNSIGNED DEFAULT NULL,
  `product_id` bigint(20) UNSIGNED DEFAULT NULL,
  `barcode` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `variant` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `client_cart_items`
--

CREATE TABLE `client_cart_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_ref` varchar(255) NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `barcode` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `client_cart_items`
--

INSERT INTO `client_cart_items` (`id`, `user_ref`, `product_id`, `barcode`, `quantity`, `created_at`, `updated_at`) VALUES
(20, '1c1b91f3-d956-4206-bdc2-5ed184e721e0', 35, '350300', 2, '2026-03-08 05:54:41', '2026-03-08 05:54:59'),
(22, '7e8769dd-84c7-4851-b247-e637f2fd925b', 35, '350300', 1, '2026-04-02 05:46:28', '2026-04-02 05:46:28'),
(23, '829a8543-46a5-492e-8644-ed3b0f1e70d6', 40, '400503', 1, '2026-04-16 05:37:05', '2026-04-16 05:37:05');

-- --------------------------------------------------------

--
-- Table structure for table `colors`
--

CREATE TABLE `colors` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `colors`
--

INSERT INTO `colors` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Black', '2025-12-11 06:58:27', '2025-12-11 06:58:27'),
(2, 'Red', '2025-12-11 06:59:06', '2025-12-11 06:59:06'),
(3, 'Blue', '2025-12-11 06:59:06', '2025-12-11 06:59:06'),
(4, 'Green', '2025-12-11 06:59:06', '2025-12-11 06:59:06'),
(5, 'Black', '2025-12-11 06:59:06', '2025-12-11 06:59:06'),
(6, 'White', '2025-12-11 06:59:06', '2025-12-11 06:59:06'),
(7, 'Yellow', '2025-12-11 06:59:06', '2025-12-11 06:59:06'),
(8, 'Purple', '2025-12-11 06:59:06', '2025-12-11 06:59:06'),
(9, 'Gray', '2025-12-11 06:59:06', '2025-12-11 06:59:06');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(10) UNSIGNED NOT NULL,
  `address` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `issue_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `expire_date` timestamp NULL DEFAULT NULL,
  `action` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `customer` varchar(255) NOT NULL,
  `group_id` int(10) UNSIGNED DEFAULT NULL,
  `membership_id` int(10) UNSIGNED DEFAULT NULL,
  `fraud` enum('true','false') DEFAULT 'false',
  `remarks` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `address`, `phone`, `issue_date`, `expire_date`, `action`, `created_at`, `updated_at`, `customer`, `group_id`, `membership_id`, `fraud`, `remarks`) VALUES
(16, '123 Customer Lane, Dhaka', '+880-1700-0101', '2025-12-11 08:02:41', '2026-12-11 08:02:41', 1, '2025-12-11 08:02:41', '2025-12-11 08:02:41', 'Customer 1', NULL, NULL, 'false', NULL),
(17, '456 Customer Avenue, Chittagong', '+880-1800-0102', '2025-12-11 08:02:41', '2026-12-11 08:02:41', 1, '2025-12-11 08:02:41', '2025-12-11 08:02:41', 'Customer 2', NULL, NULL, 'false', NULL),
(18, '789 Customer Road, Sylhet', '+880-1900-0103', '2025-12-11 08:02:41', '2026-12-11 08:02:41', 0, '2025-12-11 08:02:41', '2025-12-11 08:02:41', 'Customer 3', NULL, NULL, 'false', NULL),
(19, '321 Customer Street, Rajshahi', '+880-1600-0104', '2025-12-11 08:02:41', '2026-12-11 08:02:41', 1, '2025-12-11 08:02:41', '2025-12-11 08:02:41', 'Customer 4', NULL, NULL, 'true', 'he is not a good man'),
(20, '654 Customer Boulevard, Khulna', '+880-1500-0105', '2025-12-11 08:02:41', '2026-12-11 08:02:41', 1, '2025-12-11 08:02:41', '2025-12-11 08:02:41', 'Customer 5', NULL, NULL, 'false', NULL),
(21, '987 Customer Drive, Barisal', '+880-1700-0106', '2025-12-11 08:02:41', '2026-12-11 08:02:41', 0, '2025-12-11 08:02:41', '2025-12-11 08:02:41', 'Customer 6', NULL, NULL, 'false', NULL),
(22, '135 Customer Way, Rangpur', '+880-1800-0107', '2025-12-11 08:02:41', '2026-12-11 08:02:41', 1, '2025-12-11 08:02:41', '2025-12-11 08:02:41', 'Customer 7', NULL, NULL, 'false', NULL),
(23, '246 Customer Place, Mymensingh', '+880-1900-0108', '2025-12-11 08:02:41', '2026-12-11 08:02:41', 1, '2025-12-11 08:02:41', '2025-12-11 08:02:41', 'Customer 8', NULL, NULL, 'false', NULL),
(24, '60 FIT ROAD MONIPUR', '01860574432', '2026-02-25 04:16:07', NULL, NULL, '2026-02-25 04:16:07', '2026-02-25 04:16:07', 'Abu Raihan', NULL, NULL, 'false', NULL),
(25, '60 FIT ROAD MONIPUR', '01860574432', '2026-02-25 04:33:43', NULL, NULL, '2026-02-25 04:33:43', '2026-02-25 04:33:43', 'Abu Raihan', NULL, NULL, 'false', NULL),
(26, '60 FIT ROAD MONIPUR', '01860574432', '2026-02-25 04:35:49', NULL, NULL, '2026-02-25 04:35:49', '2026-02-25 04:35:49', 'Abu Raihan', NULL, NULL, 'false', NULL),
(27, '60 FIT ROAD MONIPUR', '01860574432', '2026-02-25 04:36:13', NULL, NULL, '2026-02-25 04:36:13', '2026-02-25 04:36:13', 'Abu Raihan', NULL, NULL, 'false', NULL),
(28, '60 FIT ROAD MONIPUR', '01860574432', '2026-02-25 04:39:00', NULL, NULL, '2026-02-25 04:39:00', '2026-02-25 04:39:00', 'Abu Raihan', NULL, NULL, 'false', NULL),
(29, '60 FIT ROAD MONIPUR', '01860574432', '2026-02-25 10:36:56', NULL, NULL, '2026-02-25 10:36:56', '2026-02-25 10:36:56', 'Abu Raihan', NULL, NULL, 'false', NULL),
(30, '60 FIT ROAD MONIPUR', '01860574432', '2026-02-26 04:18:27', NULL, NULL, '2026-02-26 04:18:27', '2026-02-26 04:18:27', 'Abu Raihan', NULL, NULL, 'false', NULL),
(31, '60 FIT ROAD MONIPUR', '01860574432', '2026-02-26 04:19:10', NULL, NULL, '2026-02-26 04:19:10', '2026-02-26 04:19:10', 'Abu Raihan', NULL, NULL, 'false', NULL),
(32, '60 FIT ROAD MONIPUR', '01860574432', '2026-03-07 05:54:25', NULL, NULL, '2026-03-07 05:54:25', '2026-03-07 05:54:25', 'Abu Raihan', NULL, NULL, 'false', NULL),
(33, 'MIRPUR DHAKA', '01744155760', '2026-03-07 06:06:05', NULL, NULL, '2026-03-07 06:06:05', '2026-03-07 06:06:05', 'Anik sarker', NULL, NULL, 'false', NULL),
(34, 'Mirpur dhaka', '01744155760', '2026-03-07 08:32:02', NULL, NULL, '2026-03-07 08:32:02', '2026-03-07 08:32:02', 'Anik sarker', NULL, NULL, 'false', NULL),
(36, 'MIRPUR DHAKA', '01744155760', '2026-03-07 08:37:55', NULL, NULL, '2026-03-07 08:37:55', '2026-03-07 08:37:55', 'Anik sarker', NULL, NULL, 'false', NULL),
(48, 'MIRPUR DHAKA', '01744155760', '2026-03-07 09:33:25', NULL, NULL, '2026-03-07 09:33:25', '2026-03-07 09:33:25', 'Anik sarker', NULL, NULL, 'false', NULL),
(49, 'MIRPUR DHAKA', '01744155760', '2026-03-07 09:34:25', NULL, NULL, '2026-03-07 09:34:25', '2026-03-07 09:34:25', 'Anik sarker', NULL, NULL, 'false', NULL),
(52, 'MIRPUR DHAKA', '01744155760', '2026-03-07 09:34:47', NULL, NULL, '2026-03-07 09:34:47', '2026-03-07 09:34:47', 'Anik sarker', NULL, NULL, 'false', NULL),
(56, 'MIRPUR DHAKA', '01744155760', '2026-03-07 09:35:35', NULL, NULL, '2026-03-07 09:35:35', '2026-03-07 09:35:35', 'Anik', NULL, NULL, 'false', NULL),
(57, 'MIRPUR DHAKA', '01744155760', '2026-03-07 09:40:04', NULL, NULL, '2026-03-07 09:40:04', '2026-03-07 09:40:04', 'Anik', NULL, NULL, 'false', NULL),
(61, 'MIRPUR DHAKA', '01744155760', '2026-03-07 09:40:54', NULL, NULL, '2026-03-07 09:40:54', '2026-03-07 09:40:54', 'Anik', NULL, NULL, 'false', NULL),
(65, 'MIRPUR DHAKA', '01744155760', '2026-03-07 09:42:38', NULL, NULL, '2026-03-07 09:42:38', '2026-03-07 09:42:38', 'Anik', NULL, NULL, 'false', NULL),
(66, 'MIRPUR DHAKA', '01744155760', '2026-03-07 09:46:46', NULL, NULL, '2026-03-07 09:46:46', '2026-03-07 09:46:46', 'Anik', NULL, NULL, 'false', NULL),
(67, 'MIRPUR DHAKA', '01744155760', '2026-03-07 09:47:53', NULL, NULL, '2026-03-07 09:47:53', '2026-03-07 09:47:53', 'Anik sarker', NULL, NULL, 'false', NULL),
(68, 'MIRPUR DHAKA', '01744155760', '2026-03-07 09:56:29', NULL, NULL, '2026-03-07 09:56:29', '2026-03-07 09:56:29', 'Anik sarker', NULL, NULL, 'false', NULL),
(69, 'MIRPUR DHAKA', '01744155760', '2026-03-07 09:57:10', NULL, NULL, '2026-03-07 09:57:10', '2026-03-07 09:57:10', 'Anik sarker', NULL, NULL, 'false', NULL),
(70, 'MIRPUR DHAKA', '01744155760', '2026-03-07 09:57:50', NULL, NULL, '2026-03-07 09:57:50', '2026-03-07 09:57:50', 'Anik', NULL, NULL, 'false', NULL),
(71, 'MIRPUR DHAKA', '01744155760', '2026-03-07 10:01:08', NULL, NULL, '2026-03-07 10:01:08', '2026-03-07 10:01:08', 'Anik sarker', NULL, NULL, 'false', NULL),
(72, 'MIRPUR DHAKA', '01744155760', '2026-03-07 10:01:35', NULL, NULL, '2026-03-07 10:01:35', '2026-03-07 10:01:35', 'Anik', NULL, NULL, 'false', NULL),
(73, 'MIRPUR DHAKA', '01744155760', '2026-03-07 10:12:49', NULL, NULL, '2026-03-07 10:12:49', '2026-03-07 10:12:49', 'Anik', NULL, NULL, 'false', NULL),
(74, '60 FIT ROAD MONIPUR', '01860574432', '2026-03-07 10:16:23', NULL, NULL, '2026-03-07 10:16:23', '2026-03-07 10:16:23', 'Abu Raihan', NULL, NULL, 'false', NULL),
(75, 'MIRPUR DHAKA', '01744155760', '2026-03-07 10:20:13', NULL, NULL, '2026-03-07 10:20:13', '2026-03-07 10:20:13', 'Anik sarker', NULL, NULL, 'false', NULL),
(76, 'MIRPUR DHAKA', '01744155760', '2026-03-07 10:20:35', NULL, NULL, '2026-03-07 10:20:35', '2026-03-07 10:20:35', 'Anik sarker', NULL, NULL, 'false', NULL),
(77, 'MIRPUR DHAKA', '01744155760', '2026-03-07 10:20:50', NULL, NULL, '2026-03-07 10:20:50', '2026-03-07 10:20:50', 'Anik sarker', NULL, NULL, 'false', NULL),
(78, 'MIRPUR DHAKA', '01744155760', '2026-03-07 10:20:55', NULL, NULL, '2026-03-07 10:20:55', '2026-03-07 10:20:55', 'Anik', NULL, NULL, 'false', NULL),
(79, 'MIRPUR DHAKA', '01744155760', '2026-03-07 10:23:02', NULL, NULL, '2026-03-07 10:23:02', '2026-03-07 10:23:02', 'Anik sarker', NULL, NULL, 'false', NULL),
(80, 'MIRPUR DHAKA', '01744155760', '2026-03-07 10:25:09', NULL, NULL, '2026-03-07 10:25:09', '2026-03-07 10:25:09', 'Anik', NULL, NULL, 'false', NULL),
(82, 'MIRPUR DHAKA', '01744155760', '2026-03-07 10:25:44', NULL, NULL, '2026-03-07 10:25:44', '2026-03-07 10:25:44', 'Anik', NULL, NULL, 'false', NULL),
(83, 'MIRPUR DHAKA', '01744155760', '2026-03-07 10:28:27', NULL, NULL, '2026-03-07 10:28:27', '2026-03-07 10:28:27', 'Anik', NULL, NULL, 'false', NULL),
(84, 'MIRPUR DHAKA', '01744155760', '2026-03-08 04:20:07', NULL, NULL, '2026-03-08 04:20:07', '2026-03-08 04:20:07', 'Anik sarker', NULL, NULL, 'false', NULL),
(85, '60 fit road Monipur', '01860574432', '2026-03-08 04:29:37', NULL, NULL, '2026-03-08 04:29:37', '2026-03-08 04:29:37', 'Abu Raihan', NULL, NULL, 'false', NULL),
(86, 'MIRPUR DHAKA', '01744155760', '2026-03-08 05:32:21', NULL, NULL, '2026-03-08 05:32:21', '2026-03-08 05:32:21', 'Anik sarker', NULL, NULL, 'false', NULL),
(87, 'MIRPUR DHAKA', '01744155760', '2026-04-02 05:39:15', NULL, NULL, '2026-04-02 05:39:15', '2026-04-02 05:39:15', 'Anik', NULL, NULL, 'false', NULL),
(88, '60 FIT ROAD MONIPUR', '01860574432', '2026-04-02 05:40:04', NULL, NULL, '2026-04-02 05:40:04', '2026-04-02 05:40:04', 'Abu Raihan', NULL, NULL, 'false', NULL),
(89, 'MIRPUR DHAKA', '01744155760', '2026-04-02 05:40:41', NULL, NULL, '2026-04-02 05:40:41', '2026-04-02 05:40:41', 'Anik', NULL, NULL, 'false', NULL),
(90, 'MIRPUR DHAKA', '01744155760', '2026-04-02 05:43:36', NULL, NULL, '2026-04-02 05:43:36', '2026-04-02 05:43:36', 'Anik sarker', NULL, NULL, 'false', NULL),
(98, 'MIRPUR DHAKA', '01744155760', '2026-04-05 06:22:22', NULL, NULL, '2026-04-05 06:22:22', '2026-04-05 06:22:22', 'Anik sarker', NULL, NULL, 'false', NULL),
(99, 'MIRPUR DHAKA', '01744155760', '2026-04-05 07:02:11', NULL, NULL, '2026-04-05 07:02:11', '2026-04-05 07:02:11', 'Anik sarker', NULL, NULL, 'false', NULL),
(100, '60 FIT ROAD MONIPUR', '01860574432', '2026-04-05 07:02:57', NULL, NULL, '2026-04-05 07:02:57', '2026-04-05 07:02:57', 'Abu Raihan', NULL, NULL, 'false', NULL),
(101, 'MIRPUR DHAKA', '01744155760', '2026-04-05 07:24:24', NULL, NULL, '2026-04-05 07:24:24', '2026-04-05 07:24:24', 'Anik sarker', NULL, NULL, 'false', NULL),
(103, '60 FIT ROAD MONIPUR', '01860574432', '2026-04-06 11:00:51', NULL, NULL, '2026-04-06 11:00:51', '2026-04-06 11:00:51', 'Abu Raihan', NULL, NULL, 'false', NULL),
(104, '60 FIT ROAD MONIPUR', '01860574432', '2026-04-06 11:01:26', NULL, NULL, '2026-04-06 11:01:26', '2026-04-06 11:01:26', 'Abu Raihan', NULL, NULL, 'false', NULL),
(106, 'MIRPUR DHAKA', '01744155760', '2026-04-06 11:02:43', NULL, NULL, '2026-04-06 11:02:43', '2026-04-06 11:02:43', 'Anik', NULL, NULL, 'false', NULL),
(107, '60 FIT ROAD MONIPUR', '01860574432', '2026-04-06 12:00:32', NULL, NULL, '2026-04-06 12:00:32', '2026-04-06 12:00:32', 'Abu Raihan', NULL, NULL, 'false', NULL),
(108, '60 FIT ROAD MONIPUR', '01860574432', '2026-04-06 12:01:40', NULL, NULL, '2026-04-06 12:01:40', '2026-04-06 12:01:40', 'Abu Raihan', NULL, NULL, 'false', NULL),
(109, 'MIRPUR DHAKA', '01744155760', '2026-04-06 12:03:53', NULL, NULL, '2026-04-06 12:03:53', '2026-04-06 12:03:53', 'Anik', NULL, NULL, 'false', NULL),
(110, 'MIRPUR DHAKA', '01744155760', '2026-04-07 04:55:38', NULL, NULL, '2026-04-07 04:55:38', '2026-04-07 04:55:38', 'Anik', NULL, NULL, 'false', NULL),
(111, '60 FIT ROAD MONIPUR', '01860574432', '2026-04-07 04:57:04', NULL, NULL, '2026-04-07 04:57:04', '2026-04-07 04:57:04', 'Abu Raihan', NULL, NULL, 'false', NULL),
(112, 'MIRPUR DHAKA', '01744155760', '2026-04-07 04:59:02', NULL, NULL, '2026-04-07 04:59:02', '2026-04-07 04:59:02', 'Anik', NULL, NULL, 'false', NULL),
(113, 'MIRPUR DHAKA', '01744155760', '2026-04-07 05:21:16', NULL, NULL, '2026-04-07 05:21:16', '2026-04-07 05:21:16', 'Anik', NULL, NULL, 'false', NULL),
(114, '60 FIT ROAD MONIPUR', '01860574432', '2026-04-07 05:24:52', NULL, NULL, '2026-04-07 05:24:52', '2026-04-07 05:24:52', 'Abu Raihan', NULL, NULL, 'false', NULL),
(115, 'MIRPUR DHAKA', '01744155760', '2026-04-07 05:25:59', NULL, NULL, '2026-04-07 05:25:59', '2026-04-07 05:25:59', 'Anik', NULL, NULL, 'false', NULL),
(116, 'MIRPUR DHAKA', '01744155760', '2026-04-07 05:27:55', NULL, NULL, '2026-04-07 05:27:55', '2026-04-07 05:27:55', 'Anik', NULL, NULL, 'false', NULL),
(117, '60 FIT ROAD MONIPUR', '01860574432', '2026-04-07 05:34:07', NULL, NULL, '2026-04-07 05:34:07', '2026-04-07 05:34:07', 'Abu Raihan', NULL, NULL, 'false', NULL),
(118, 'MIRPUR DHAKA', '01744155760', '2026-04-07 05:38:06', NULL, NULL, '2026-04-07 05:38:06', '2026-04-07 05:38:06', 'Anik', NULL, NULL, 'false', NULL),
(119, '60 FIT ROAD MONIPUR', '01860574432', '2026-04-07 05:38:25', NULL, NULL, '2026-04-07 05:38:25', '2026-04-07 05:38:25', 'Abu Raihan', NULL, NULL, 'false', NULL),
(120, 'MIRPUR DHAKA', '01744155760', '2026-04-07 05:42:58', NULL, NULL, '2026-04-07 05:42:58', '2026-04-07 05:42:58', 'Anik', NULL, NULL, 'false', NULL),
(121, 'MIRPUR DHAKA', '01744155760', '2026-04-07 05:43:16', NULL, NULL, '2026-04-07 05:43:16', '2026-04-07 05:43:16', 'Anik sarker', NULL, NULL, 'false', NULL),
(122, 'MIRPUR DHAKA', '01744155760', '2026-04-07 06:02:57', NULL, NULL, '2026-04-07 06:02:57', '2026-04-07 06:02:57', 'Anik', NULL, NULL, 'false', NULL),
(123, 'MIRPUR DHAKA', '01744155760', '2026-04-07 06:03:12', NULL, NULL, '2026-04-07 06:03:12', '2026-04-07 06:03:12', 'Anik', NULL, NULL, 'false', NULL),
(124, '60 FIT ROAD MONIPUR', '01860574432', '2026-04-07 09:53:05', NULL, NULL, '2026-04-07 09:53:05', '2026-04-07 09:53:05', 'Abu Raihan', NULL, NULL, 'false', NULL),
(125, '60 FIT ROAD MONIPUR', '01860574432', '2026-04-11 05:21:45', NULL, NULL, '2026-04-11 05:21:45', '2026-04-11 05:21:45', 'Abu Raihan', NULL, NULL, 'false', NULL),
(126, 'MIRPUR DHAKA', '01744155760', '2026-04-11 05:22:15', NULL, NULL, '2026-04-11 05:22:15', '2026-04-11 05:22:15', 'Anik', NULL, NULL, 'false', NULL),
(127, '60 FIT ROAD MONIPUR', '01860574432', '2026-04-13 08:45:41', NULL, NULL, '2026-04-13 08:45:41', '2026-04-13 08:45:41', 'Abu Raihan', NULL, NULL, 'false', NULL),
(128, 'MIRPUR DHAKA', '01744155760', '2026-04-13 08:46:49', NULL, NULL, '2026-04-13 08:46:49', '2026-04-13 08:46:49', 'Anik', NULL, NULL, 'false', NULL),
(129, '60 FIT ROAD MONIPUR', '01860574432', '2026-04-13 10:03:20', NULL, NULL, '2026-04-13 10:03:20', '2026-04-13 10:03:20', 'Abu Raihan', NULL, NULL, 'false', NULL),
(130, '60 FIT ROAD MONIPUR', '01860574432', '2026-04-13 10:16:39', NULL, NULL, '2026-04-13 10:16:39', '2026-04-13 10:16:39', 'Abu Raihan', NULL, NULL, 'false', NULL),
(131, 'MIRPUR DHAKA', '01744155760', '2026-04-13 10:17:31', NULL, NULL, '2026-04-13 10:17:31', '2026-04-13 10:17:31', 'Anik', NULL, NULL, 'false', NULL),
(132, '60 FIT ROAD MONIPUR', '01860574432', '2026-04-15 08:15:48', NULL, NULL, '2026-04-15 08:15:48', '2026-04-15 08:15:48', 'Abu Raihan', NULL, NULL, 'false', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'A', '2025-12-11 08:05:34', '2025-12-11 08:05:34'),
(2, 'A', '2025-12-11 08:05:40', '2025-12-11 08:05:40');

-- --------------------------------------------------------

--
-- Table structure for table `images`
--

CREATE TABLE `images` (
  `id` int(10) UNSIGNED NOT NULL,
  `url` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `images`
--

INSERT INTO `images` (`id`, `url`, `created_at`, `updated_at`) VALUES
(1, '/images/products/product-djns1-1762334201969.webp', '2025-11-05 09:16:41', '2025-11-05 09:16:41'),
(2, '/images/products/product-ks1f2-1762344402949.avif', '2025-11-05 12:06:42', '2025-11-05 12:06:42'),
(3, '/images/products/product-zq7mi-1762344469941.webp', '2025-11-05 12:07:49', '2025-11-05 12:07:49'),
(4, '/images/products/product-b5fr0-1762347955905.jpg', '2025-11-05 13:05:55', '2025-11-05 13:05:55'),
(5, '/images/products/product-d7gel-1762433611885.webp', '2025-11-06 12:53:31', '2025-11-06 12:53:31'),
(6, '/images/products/product-u42i8-1765436444546.png', '2025-12-11 07:00:44', '2025-12-11 07:00:44'),
(7, '/images/products/product-r9aah-1765437322918.png', '2025-12-11 07:15:22', '2025-12-11 07:15:22'),
(8, '/images/products/product-di8am-1765439454369.png', '2025-12-11 07:50:54', '2025-12-11 07:50:54'),
(9, '/images/products/product-x2qmm-1765439541206.png', '2025-12-11 07:52:21', '2025-12-11 07:52:21'),
(10, '/images/products/product-kduqb-1765439610978.png', '2025-12-11 07:53:30', '2025-12-11 07:53:30'),
(11, '/images/products/product-4dpq9-1765439717199.png', '2025-12-11 07:55:17', '2025-12-11 07:55:17'),
(12, '/images/products/product-lbaz0-1765442193861.png', '2025-12-11 08:36:33', '2025-12-11 08:36:33'),
(13, '/images/products/product-bfltr-1771999309096.jpg', '2026-02-25 06:01:49', '2026-02-25 06:01:49'),
(16, '/images/products/product-y8jrg-1772003081780.jpg', '2026-02-25 07:04:41', '2026-02-25 07:04:41'),
(17, '/images/products/product-jjbjx-1772004174941.jpg', '2026-02-25 07:22:54', '2026-02-25 07:22:54'),
(22, '/images/products/product-09omf-1772942272179.png', '2026-03-08 03:57:52', '2026-03-08 03:57:52'),
(23, '/images/products/product-udlzq-1772943056331.png', '2026-03-08 04:10:56', '2026-03-08 04:10:56'),
(24, '/images/products/product-fnn2z-1772945866647.png', '2026-03-08 04:57:46', '2026-03-08 04:57:46'),
(25, '/images/products/product-n3aih-1775471843045.jpg', '2026-04-06 10:37:23', '2026-04-06 10:37:23');

-- --------------------------------------------------------

--
-- Table structure for table `knex_migrations`
--

CREATE TABLE `knex_migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `batch` int(11) DEFAULT NULL,
  `migration_time` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `knex_migrations`
--

INSERT INTO `knex_migrations` (`id`, `name`, `batch`, `migration_time`) VALUES
(1, '20241009094332_user.ts', 1, '2025-11-05 06:36:06'),
(2, '20241009110321_account.ts', 1, '2025-11-05 06:36:06'),
(3, '20241009110337_session.ts', 1, '2025-11-05 06:36:06'),
(4, '20241009110423_verification_token.ts', 1, '2025-11-05 06:36:06'),
(5, '20241009110442_product.ts', 1, '2025-11-05 06:36:07'),
(6, '20241009110453_category.ts', 1, '2025-11-05 06:36:07'),
(7, '20241009110503_brand.ts', 1, '2025-11-05 06:36:07'),
(8, '20241009110515_color.ts', 1, '2025-11-05 06:36:07'),
(9, '20241009110529_size.ts', 1, '2025-11-05 06:36:07'),
(10, '20241009110541_image.ts', 1, '2025-11-05 06:36:07'),
(11, '20241009110553_product_color.ts', 1, '2025-11-05 06:36:07'),
(12, '20241009110606_product_size.ts', 1, '2025-11-05 06:36:07'),
(13, '20241009110623_branch.ts', 1, '2025-11-05 06:36:07'),
(14, '20241009110636_branch_user.ts', 1, '2025-11-05 06:36:07'),
(15, '20241009110650_stock_history.ts', 1, '2025-11-05 06:36:07'),
(16, '20241009110704_stock.ts', 1, '2025-11-05 06:36:07'),
(17, '20241009110715_challan.ts', 1, '2025-11-05 06:36:07'),
(18, '20241009110727_challan_item.ts', 1, '2025-11-05 06:36:07'),
(19, '20241009110736_customer.ts', 2, '2025-11-05 06:37:44'),
(20, '20241009110746_group.ts', 2, '2025-11-05 06:37:44'),
(21, '20241009110757_membership.ts', 2, '2025-11-05 06:37:44'),
(22, '20241009110810_order.ts', 2, '2025-11-05 06:37:44'),
(23, '20241009110823_order_item.ts', 2, '2025-11-05 06:37:45'),
(24, '20241009172446_sales.ts', 2, '2025-11-05 06:37:45'),
(25, '20241009173818_products_foreign_key_update.ts', 2, '2025-11-05 06:37:45'),
(26, '20241010072608_customer_key_update.ts', 2, '2025-11-05 06:37:45'),
(27, '20241014211232_update_customer_table.ts', 2, '2025-11-05 06:37:45'),
(28, '20241027183929_update_order_table.ts', 2, '2025-11-05 06:37:45'),
(29, '20241108135053_update_stocks_table_key.ts', 2, '2025-11-05 06:37:45'),
(30, '20241109181525_update_challan_key.ts', 2, '2025-11-05 06:37:45'),
(31, '20241114075651_create_order_serial_table.ts', 2, '2025-11-05 06:37:45'),
(32, '20241114173143_update_customer_keys.ts', 2, '2025-11-05 06:37:45'),
(33, '20241119090735_update_order_items_table_key.ts', 2, '2025-11-05 06:37:45'),
(34, '20241122160436_update_users_key.ts', 2, '2025-11-05 06:37:45'),
(35, '20241122182611_update_users_key_phone.ts', 2, '2025-11-05 06:37:45'),
(36, '20241226071333_create_settings_table.ts', 2, '2025-11-05 06:37:45'),
(37, '20241226074444_create_setting_table_2.ts', 2, '2025-11-05 06:37:45'),
(38, '20241227200051_orders_key_alter.ts', 2, '2025-11-05 06:37:45'),
(39, '20250114173831_orders_table_alter.ts', 2, '2025-11-05 06:37:45'),
(40, '20250120193118_orders_table_alter_key_subtotal.ts', 2, '2025-11-05 06:37:45'),
(41, '20250124180656_order_items_table_alter.ts', 2, '2025-11-05 06:37:45'),
(42, '20250124192442_add_payment_methods_table.ts', 2, '2025-11-05 06:37:45'),
(43, '20250124193230_payment_table_alter.ts', 2, '2025-11-05 06:37:45'),
(44, '20250126181111_create_settings_table.ts', 2, '2025-11-05 06:37:45'),
(45, '20250127162748_alter_settings_data.ts', 2, '2025-11-05 06:37:45'),
(46, '20250219175858_create_table_barcode_serial.ts', 2, '2025-11-05 06:37:45'),
(47, '20250223195824_stock_table_alter.ts', 2, '2025-11-05 06:37:45'),
(48, '20250223201013_alter_stocks_table.ts', 2, '2025-11-05 06:37:45'),
(49, '20250228223533_stocks_table_alter.ts', 2, '2025-11-05 06:37:45'),
(50, '20250302172130_order_items_table_alter.ts', 2, '2025-11-05 06:37:45'),
(51, '20250305053348_migrate.ts', 2, '2025-11-05 06:37:45'),
(52, '20250305061005_migrate_01.ts', 2, '2025-11-05 06:37:45'),
(53, '20250305061510_migrate_02.ts', 2, '2025-11-05 06:37:45'),
(54, '20250310193842_alter_products_table.ts', 2, '2025-11-05 06:37:45'),
(55, '20250311002837_alter_products_table.ts', 2, '2025-11-05 06:37:45'),
(56, '20250316081045_alter_products_table.ts', 2, '2025-11-05 06:37:45'),
(57, '20250318191204_add_foreign_keys.ts', 2, '2025-11-05 06:37:45'),
(58, '20250318201656_add_foreign_keys_again.ts', 2, '2025-11-05 06:37:45'),
(59, '20250318203905_add_more_foreign_keys.ts', 2, '2025-11-05 06:37:45'),
(60, '20250319021841_create_trading_table.ts', 2, '2025-11-05 06:37:45'),
(61, '20250319033007_alter_tradings_table.ts', 2, '2025-11-05 06:37:45'),
(62, '20250319035741_foreign_key_for.ts', 2, '2025-11-05 06:37:45'),
(63, '20250319040350_foreign_key_for_tradings.ts', 2, '2025-11-05 06:37:45'),
(64, '20250319233445_create_trading_product_table.ts', 2, '2025-11-05 06:37:45'),
(65, '20250321165243_alter_tradings_table.ts', 2, '2025-11-05 06:37:45'),
(66, '20250321190226_orders_&_tradings_table_alter.ts', 2, '2025-11-05 06:37:45');

-- --------------------------------------------------------

--
-- Table structure for table `knex_migrations_lock`
--

CREATE TABLE `knex_migrations_lock` (
  `index` int(10) UNSIGNED NOT NULL,
  `is_locked` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `knex_migrations_lock`
--

INSERT INTO `knex_migrations_lock` (`index`, `is_locked`) VALUES
(1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `memberships`
--

CREATE TABLE `memberships` (
  `id` int(10) UNSIGNED NOT NULL,
  `type` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` varchar(255) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `total` float(8,2) NOT NULL,
  `status` enum('COMPLETED','EXCHANGED','RETURN') DEFAULT 'COMPLETED',
  `customer_id` int(10) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `action` tinyint(1) DEFAULT NULL,
  `branch_id` int(10) UNSIGNED DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `discount` int(11) DEFAULT NULL,
  `vat` int(11) DEFAULT NULL,
  `delivery_charge` int(11) DEFAULT NULL,
  `due_amount` int(11) DEFAULT NULL,
  `paid_amount` int(11) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `sub_total` int(11) DEFAULT NULL,
  `sale_channel` varchar(255) NOT NULL DEFAULT 'OFFLINE',
  `supplier_id` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_id`, `date`, `total`, `status`, `customer_id`, `created_at`, `updated_at`, `action`, `branch_id`, `comment`, `discount`, `vat`, `delivery_charge`, `due_amount`, `paid_amount`, `payment_method`, `sub_total`, `sale_channel`, `supplier_id`) VALUES
(24, 'ORD-001', '2025-12-11 08:14:55', 249.97, 'COMPLETED', 1, '2025-12-11 08:14:55', '2025-12-11 08:14:55', 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'OFFLINE', NULL),
(25, 'ORD-002', '2025-12-11 08:14:55', 89.98, 'COMPLETED', 2, '2025-12-11 08:14:55', '2025-12-11 08:14:55', 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'OFFLINE', NULL),
(26, 'ORD-003', '2025-12-11 08:14:55', 199.98, 'RETURN', 3, '2025-12-11 08:14:55', '2025-12-11 08:14:55', 0, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'OFFLINE', NULL),
(27, 'ORD-004', '2025-12-11 08:14:55', 129.99, 'COMPLETED', 4, '2025-12-11 08:14:55', '2025-12-11 08:14:55', 1, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'OFFLINE', NULL),
(28, 'ORD-005', '2025-12-11 08:14:55', 349.96, 'COMPLETED', 5, '2025-12-11 08:14:55', '2025-12-11 08:14:55', 1, 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'OFFLINE', NULL),
(29, 'ORD-006', '2025-12-11 08:14:55', 99.98, 'EXCHANGED', 6, '2025-12-11 08:14:55', '2025-12-11 08:14:55', 1, 3, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'OFFLINE', NULL),
(30, 'ORD-007', '2025-12-11 08:14:55', 179.97, 'COMPLETED', 7, '2025-12-11 08:14:55', '2025-12-11 08:14:55', 1, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'OFFLINE', NULL),
(31, 'ORD-008', '2025-12-11 08:14:55', 299.97, 'COMPLETED', 8, '2025-12-11 08:14:55', '2025-12-11 08:14:55', 1, 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'OFFLINE', NULL),
(32, '25226033', '2026-02-25 04:16:07', 2400.00, 'COMPLETED', 24, '2026-02-25 04:16:07', '2026-02-25 04:16:07', NULL, 2, NULL, 0, NULL, 0, 0, 2400, 'Cash On Delivery', 2400, 'OFFLINE', NULL),
(33, '25226035', '2026-02-25 04:33:43', 1200.00, 'COMPLETED', 25, '2026-02-25 04:33:43', '2026-02-25 04:33:43', NULL, 2, NULL, 0, NULL, 0, NULL, NULL, NULL, 1200, 'OFFLINE', NULL),
(34, '25226036', '2026-02-25 04:35:49', 1200.00, 'COMPLETED', 26, '2026-02-25 04:35:49', '2026-02-25 04:35:49', NULL, 2, NULL, 0, NULL, 0, NULL, NULL, NULL, 1200, 'OFFLINE', NULL),
(35, '25226037', '2026-02-25 04:36:13', 1200.00, 'COMPLETED', 27, '2026-02-25 04:36:13', '2026-02-25 04:36:13', NULL, 2, NULL, 0, NULL, 0, 1200, 0, 'Nagad', 1200, 'OFFLINE', NULL),
(36, '25226040', '2026-02-25 04:39:00', 2760.00, 'COMPLETED', 28, '2026-02-25 04:39:00', '2026-02-25 04:39:00', NULL, 2, NULL, 0, NULL, 0, 2760, 0, 'Cash On Delivery', 2760, 'OFFLINE', NULL),
(37, '25226063', '2026-02-25 10:36:56', 2520.00, 'RETURN', 29, '2026-02-25 10:36:56', '2026-02-25 10:36:56', NULL, 2, 'undefined', 0, NULL, 0, 2520, 0, 'Cash On Delivery', 2520, 'OFFLINE', NULL),
(38, '26226065', '2026-02-26 04:18:27', 1200.00, 'COMPLETED', 30, '2026-02-26 04:18:27', '2026-02-26 04:18:27', NULL, 2, NULL, 0, NULL, 0, NULL, NULL, NULL, 1200, 'OFFLINE', NULL),
(39, '26226066', '2026-02-26 04:19:10', 1200.00, 'COMPLETED', 31, '2026-02-26 04:19:10', '2026-02-26 04:19:10', NULL, 2, NULL, 0, NULL, 0, 0, 1200, 'Cash On Delivery', 1200, 'OFFLINE', NULL),
(40, '7326087', '2026-03-07 05:54:25', 1620.00, 'COMPLETED', 32, '2026-03-07 05:54:25', '2026-03-07 05:54:25', NULL, 2, NULL, 0, NULL, 0, 1620, 0, 'Cash On Delivery', 1620, 'OFFLINE', NULL),
(41, '7326088', '2026-03-07 06:06:05', 120.00, 'COMPLETED', 33, '2026-03-07 06:06:05', '2026-03-07 06:06:05', NULL, 2, NULL, 0, NULL, 0, 120, 0, 'Cash On Delivery', 120, 'OFFLINE', NULL),
(42, '20260307143202125', '2026-03-07 08:32:02', 2416.00, 'COMPLETED', 34, '2026-03-07 08:32:02', '2026-03-07 08:32:02', NULL, 1, NULL, 0, NULL, 0, NULL, NULL, 'CashOnDelivery', 2416, 'OFFLINE', NULL),
(44, '7326092', '2026-03-07 08:37:55', 1320.00, 'COMPLETED', 36, '2026-03-07 08:37:55', '2026-03-07 08:37:55', NULL, 2, NULL, 0, NULL, 0, 1320, 0, 'Cash On Delivery', 1320, 'OFFLINE', NULL),
(56, '7326121', '2026-03-07 09:33:25', 120.00, 'COMPLETED', 48, '2026-03-07 09:33:25', '2026-03-07 09:33:25', NULL, 2, NULL, 0, NULL, 0, NULL, NULL, NULL, 120, 'OFFLINE', NULL),
(57, '7326123', '2026-03-07 09:34:25', 17540.00, 'COMPLETED', 49, '2026-03-07 09:34:25', '2026-03-07 09:34:25', NULL, 1, NULL, 0, NULL, 0, NULL, NULL, NULL, 17540, 'OFFLINE', NULL),
(60, '7326125', '2026-03-07 09:34:47', 17540.00, 'COMPLETED', 52, '2026-03-07 09:34:47', '2026-03-07 09:34:47', NULL, 1, NULL, 0, NULL, 0, NULL, NULL, NULL, 17540, 'OFFLINE', NULL),
(64, '7326129', '2026-03-07 09:35:35', 17540.00, 'COMPLETED', 56, '2026-03-07 09:35:35', '2026-03-07 09:35:35', NULL, 1, NULL, 0, NULL, 0, 17540, 0, 'Nagad', 17540, 'OFFLINE', NULL),
(65, '7326133', '2026-03-07 09:40:04', 17540.00, 'COMPLETED', 57, '2026-03-07 09:40:04', '2026-03-07 09:40:04', NULL, 1, NULL, 0, NULL, 0, NULL, NULL, NULL, 17540, 'OFFLINE', NULL),
(69, '7326137', '2026-03-07 09:40:54', 1320.00, 'COMPLETED', 61, '2026-03-07 09:40:54', '2026-03-07 09:40:54', NULL, 1, NULL, 0, NULL, 0, NULL, NULL, NULL, 1320, 'OFFLINE', NULL),
(73, '7326147', '2026-03-07 09:42:38', 240.00, 'COMPLETED', 65, '2026-03-07 09:42:38', '2026-03-07 09:42:38', NULL, 1, NULL, 0, NULL, 0, 240, 0, 'bkash', 240, 'OFFLINE', NULL),
(74, '7326149', '2026-03-07 09:46:46', 120.00, 'COMPLETED', 66, '2026-03-07 09:46:46', '2026-03-07 09:46:46', NULL, 1, NULL, 0, NULL, 0, 120, 0, 'Cash On Delivery', 120, 'OFFLINE', NULL),
(75, '7326150', '2026-03-07 09:47:53', 120.00, 'COMPLETED', 67, '2026-03-07 09:47:53', '2026-03-07 09:47:53', NULL, 1, NULL, 0, NULL, 0, NULL, NULL, NULL, 120, 'OFFLINE', NULL),
(76, '7326153', '2026-03-07 09:56:29', 1200.00, 'COMPLETED', 68, '2026-03-07 09:56:29', '2026-03-07 09:56:29', NULL, 1, NULL, 0, NULL, 0, 1200, 0, 'Cash On Delivery', 1200, 'OFFLINE', NULL),
(77, '7326154', '2026-03-07 09:57:10', 400.00, 'COMPLETED', 69, '2026-03-07 09:57:10', '2026-03-07 09:57:10', NULL, 1, NULL, 0, NULL, 0, 400, 0, 'Nagad', 400, 'OFFLINE', NULL),
(78, '7326158', '2026-03-07 09:57:50', 400.00, 'COMPLETED', 70, '2026-03-07 09:57:50', '2026-03-07 09:57:50', NULL, 1, NULL, 0, NULL, 0, NULL, NULL, NULL, 400, 'OFFLINE', NULL),
(79, '7326170', '2026-03-07 10:01:08', 3600.00, 'COMPLETED', 71, '2026-03-07 10:01:08', '2026-03-07 10:01:08', NULL, 1, NULL, 0, NULL, 0, 3600, 0, 'Nagad', 3600, 'OFFLINE', NULL),
(80, '7326171', '2026-03-07 10:01:35', 120.00, 'COMPLETED', 72, '2026-03-07 10:01:35', '2026-03-07 10:01:35', NULL, 1, NULL, 0, NULL, 0, 120, 0, 'bkash', 120, 'OFFLINE', NULL),
(81, '7326187', '2026-03-07 10:12:49', 1680.00, 'COMPLETED', 73, '2026-03-07 10:12:49', '2026-03-07 10:12:49', NULL, 1, NULL, 0, NULL, 0, 1680, 0, 'Nagad', 1680, 'OFFLINE', NULL),
(82, '7326192', '2026-03-07 10:16:23', 2900.00, 'COMPLETED', 74, '2026-03-07 10:16:23', '2026-03-07 10:16:23', NULL, 1, NULL, 0, NULL, 0, NULL, NULL, NULL, 2900, 'OFFLINE', NULL),
(83, '7326194', '2026-03-07 10:20:13', 300.00, 'COMPLETED', 75, '2026-03-07 10:20:13', '2026-03-07 10:20:13', NULL, 2, NULL, 0, NULL, 0, NULL, NULL, NULL, 300, 'OFFLINE', NULL),
(84, '7326196', '2026-03-07 10:20:35', 90.00, 'COMPLETED', 76, '2026-03-07 10:20:35', '2026-03-07 10:20:35', NULL, 2, NULL, 0, NULL, 0, NULL, NULL, NULL, 90, 'OFFLINE', NULL),
(85, '7326198', '2026-03-07 10:20:50', 90.00, 'COMPLETED', 77, '2026-03-07 10:20:50', '2026-03-07 10:20:50', NULL, 2, NULL, 0, NULL, 0, NULL, NULL, NULL, 90, 'OFFLINE', NULL),
(86, '7326199', '2026-03-07 10:20:55', 1620.00, 'COMPLETED', 78, '2026-03-07 10:20:55', '2026-03-07 10:20:55', NULL, 2, NULL, 0, NULL, 0, NULL, NULL, NULL, 1620, 'OFFLINE', NULL),
(87, '7326200', '2026-03-07 10:23:02', 1200.00, 'COMPLETED', 79, '2026-03-07 10:23:02', '2026-03-07 10:23:02', NULL, 2, NULL, 0, NULL, 0, NULL, NULL, NULL, 1200, 'OFFLINE', NULL),
(88, '7326201', '2026-03-07 10:25:09', 120.00, 'COMPLETED', 80, '2026-03-07 10:25:09', '2026-03-07 10:25:09', NULL, 2, NULL, 0, NULL, 0, 120, 0, 'Nagad', 120, 'OFFLINE', NULL),
(90, '7326202', '2026-03-07 10:25:44', 120.00, 'COMPLETED', 82, '2026-03-07 10:25:44', '2026-03-07 10:25:44', NULL, 2, NULL, 0, NULL, 0, 120, 0, 'bkash', 120, 'OFFLINE', NULL),
(91, '7326214', '2026-03-07 10:28:27', 9600.00, 'COMPLETED', 83, '2026-03-07 10:28:27', '2026-03-07 10:28:27', NULL, 1, NULL, 0, NULL, 0, 9600, 0, 'Cash On Delivery', 9600, 'OFFLINE', NULL),
(92, '8326223', '2026-03-08 04:20:07', 2400.00, 'COMPLETED', 84, '2026-03-08 04:20:07', '2026-03-08 04:20:07', NULL, 2, NULL, 0, NULL, 0, 2400, 0, 'Nagad', 2400, 'OFFLINE', NULL),
(93, '20260308102937385', '2026-03-08 04:29:37', 1260.00, 'COMPLETED', 85, '2026-03-08 04:29:37', '2026-03-08 04:29:37', NULL, 2, NULL, 0, NULL, 60, NULL, NULL, 'Online', 1200, 'OFFLINE', NULL),
(94, '8326225', '2026-03-08 05:32:21', 1200.00, 'COMPLETED', 86, '2026-03-08 05:32:21', '2026-03-08 05:32:21', NULL, 2, NULL, 0, NULL, 0, 1200, 0, 'Bank Account', 1200, 'OFFLINE', NULL),
(95, '2426228', '2026-04-02 05:39:15', 1200.00, 'COMPLETED', 87, '2026-04-02 05:39:15', '2026-04-02 05:39:15', NULL, 2, NULL, 0, NULL, 0, NULL, NULL, NULL, 1200, 'OFFLINE', NULL),
(96, '2426229', '2026-04-02 05:40:04', 1200.00, 'COMPLETED', 88, '2026-04-02 05:40:04', '2026-04-02 05:40:04', NULL, 2, NULL, 0, NULL, 0, NULL, NULL, NULL, 1200, 'OFFLINE', NULL),
(97, '2426230', '2026-04-02 05:40:41', 1200.00, 'COMPLETED', 89, '2026-04-02 05:40:41', '2026-04-02 05:40:41', NULL, 2, NULL, 0, NULL, 0, 0, 1200, 'bkash', 1200, 'OFFLINE', NULL),
(98, '2426232', '2026-04-02 05:43:36', 1200.00, 'COMPLETED', 90, '2026-04-02 05:43:36', '2026-04-02 05:43:36', NULL, 2, NULL, 0, NULL, 0, NULL, NULL, NULL, 1200, 'OFFLINE', NULL),
(106, '5426250', '2026-04-05 06:22:22', 3000.00, 'EXCHANGED', 98, '2026-04-05 06:22:22', '2026-04-05 06:22:22', NULL, 2, NULL, 0, NULL, 0, 0, 1500, 'Cash On Delivery', 0, 'OFFLINE', NULL),
(107, '', '2026-04-05 07:02:11', 1540.00, 'COMPLETED', 99, '2026-04-05 07:02:11', '2026-04-05 07:02:11', NULL, 2, NULL, 0, NULL, 140, 1540, 0, 'Cash', 1500, 'OFFLINE', NULL),
(108, '5426253', '2026-04-05 07:02:57', 1500.00, 'COMPLETED', 100, '2026-04-05 07:02:57', '2026-04-05 07:02:57', NULL, 2, NULL, 0, NULL, 0, 0, 1500, 'Cash', 1500, 'OFFLINE', NULL),
(109, '5426255', '2026-04-05 07:24:24', 3000.00, 'EXCHANGED', 101, '2026-04-05 07:24:24', '2026-04-05 07:24:24', NULL, 2, NULL, 150, NULL, 0, 0, 1500, 'Cash', 0, 'OFFLINE', NULL),
(111, '6426259', '2026-04-06 11:00:51', 1500.00, 'COMPLETED', 103, '2026-04-06 11:00:51', '2026-04-06 11:00:51', NULL, 5, NULL, 0, NULL, 0, 1500, 0, 'Cash', 1500, 'OFFLINE', NULL),
(112, '6426260', '2026-04-06 11:01:26', 1500.00, 'COMPLETED', 104, '2026-04-06 11:01:26', '2026-04-06 11:01:26', NULL, 5, NULL, 0, NULL, 0, 1500, 0, 'Cash', 1500, 'OFFLINE', NULL),
(114, '6426262', '2026-04-06 11:02:43', 1200.00, 'COMPLETED', 106, '2026-04-06 11:02:43', '2026-04-06 11:02:43', NULL, 5, NULL, 0, NULL, 0, 1200, 0, 'Cash', 1200, 'OFFLINE', NULL),
(115, '6426263', '2026-04-06 12:00:32', 300.00, 'COMPLETED', 107, '2026-04-06 12:00:32', '2026-04-06 12:00:32', NULL, 2, NULL, 0, NULL, 0, NULL, NULL, NULL, 300, 'OFFLINE', NULL),
(116, '6426266', '2026-04-06 12:01:40', 300.00, 'COMPLETED', 108, '2026-04-06 12:01:40', '2026-04-06 12:01:40', NULL, 2, NULL, 0, NULL, 0, 300, 0, 'Cash', 300, 'OFFLINE', NULL),
(117, '6426267', '2026-04-06 12:03:53', 300.00, 'COMPLETED', 109, '2026-04-06 12:03:53', '2026-04-06 12:03:53', NULL, 2, NULL, 0, NULL, 0, 300, 0, 'Cash', 300, 'OFFLINE', NULL),
(118, '7426268', '2026-04-07 04:55:38', 1500.00, 'COMPLETED', 110, '2026-04-07 04:55:38', '2026-04-07 04:55:38', NULL, 2, NULL, 0, NULL, 0, 1500, 0, 'Cash', 1500, 'OFFLINE', NULL),
(119, '7426269', '2026-04-07 04:57:04', 300.00, 'COMPLETED', 111, '2026-04-07 04:57:04', '2026-04-07 04:57:04', NULL, 2, NULL, 0, NULL, 0, 300, 0, 'Cash', 300, 'OFFLINE', NULL),
(120, '7426270', '2026-04-07 04:59:02', 300.00, 'COMPLETED', 112, '2026-04-07 04:59:02', '2026-04-07 04:59:02', NULL, 2, NULL, 0, NULL, 0, 300, 0, 'Cash', 300, 'OFFLINE', NULL),
(121, '7426275', '2026-04-07 05:21:16', 300.00, 'COMPLETED', 113, '2026-04-07 05:21:16', '2026-04-07 05:21:16', NULL, 2, NULL, 0, NULL, 0, 300, 0, 'Cash', 300, 'OFFLINE', NULL),
(122, '7426276', '2026-04-07 05:24:52', 300.00, 'COMPLETED', 114, '2026-04-07 05:24:52', '2026-04-07 05:24:52', NULL, 2, NULL, 0, NULL, 0, 300, 0, 'Cash', 300, 'OFFLINE', NULL),
(123, '7426277', '2026-04-07 05:25:59', 300.00, 'COMPLETED', 115, '2026-04-07 05:25:59', '2026-04-07 05:25:59', NULL, 2, NULL, 0, NULL, 0, 300, 0, 'Cash On Delivery', 300, 'OFFLINE', NULL),
(124, '7426278', '2026-04-07 05:27:55', 300.00, 'COMPLETED', 116, '2026-04-07 05:27:55', '2026-04-07 05:27:55', NULL, 2, NULL, 0, NULL, 0, 300, 0, 'Cash', 300, 'OFFLINE', NULL),
(125, '7426279', '2026-04-07 05:34:07', 300.00, 'COMPLETED', 117, '2026-04-07 05:34:07', '2026-04-07 05:34:07', NULL, 2, NULL, 0, NULL, 0, 300, 0, 'Cash', 300, 'OFFLINE', NULL),
(126, '7426280', '2026-04-07 05:38:06', 300.00, 'COMPLETED', 118, '2026-04-07 05:38:06', '2026-04-07 05:38:06', NULL, 2, NULL, 0, NULL, 0, 300, 0, 'Cash', 300, 'OFFLINE', NULL),
(127, '7426281', '2026-04-07 05:38:25', 300.00, 'COMPLETED', 119, '2026-04-07 05:38:25', '2026-04-07 05:38:25', NULL, 2, NULL, 0, NULL, 0, 300, 0, 'Cash', 300, 'OFFLINE', NULL),
(128, '7426282', '2026-04-07 05:42:58', 1500.00, 'COMPLETED', 120, '2026-04-07 05:42:58', '2026-04-07 05:42:58', NULL, 2, NULL, 0, NULL, 0, 1500, 0, 'Cash On Delivery', 1500, 'OFFLINE', NULL),
(129, '7426284', '2026-04-07 05:43:16', 1500.00, 'COMPLETED', 121, '2026-04-07 05:43:16', '2026-04-07 05:43:16', NULL, 2, NULL, 0, NULL, 0, 1500, 0, 'Cash', 1500, 'OFFLINE', NULL),
(130, '7426285', '2026-04-07 06:02:57', 300.00, 'COMPLETED', 122, '2026-04-07 06:02:57', '2026-04-07 06:02:57', NULL, 2, NULL, 0, NULL, 0, 300, 0, 'Cash On Delivery', 300, 'OFFLINE', NULL),
(131, '7426286', '2026-04-07 06:03:12', 300.00, 'COMPLETED', 123, '2026-04-07 06:03:12', '2026-04-07 06:03:12', NULL, 2, NULL, 0, NULL, 0, 300, 0, 'Cash On Delivery', 300, 'OFFLINE', NULL),
(132, '7426287', '2026-04-07 09:53:05', 300.00, 'COMPLETED', 124, '2026-04-07 09:53:05', '2026-04-07 09:53:05', NULL, 2, NULL, 0, NULL, 0, 300, 0, 'Bank Account', 300, 'OFFLINE', NULL),
(133, '11426288', '2026-04-11 05:21:45', 300.00, 'COMPLETED', 125, '2026-04-11 05:21:45', '2026-04-11 05:21:45', NULL, 2, NULL, 0, NULL, 0, 300, 0, 'Cash', 300, 'OFFLINE', NULL),
(134, '11426289', '2026-04-11 05:22:15', 1500.00, 'COMPLETED', 126, '2026-04-11 05:22:15', '2026-04-11 05:22:15', NULL, 2, NULL, 0, NULL, 0, 1500, 0, 'bkash', 1500, 'OFFLINE', NULL),
(135, '13426293', '2026-04-13 08:45:41', 300.00, 'COMPLETED', 127, '2026-04-13 08:45:41', '2026-04-13 08:45:41', NULL, 2, NULL, 0, NULL, 0, 300, 0, 'Cash', 300, 'ONLINE', 1),
(136, '13426294', '2026-04-13 08:46:49', 300.00, 'COMPLETED', 128, '2026-04-13 08:46:49', '2026-04-13 08:46:49', NULL, 2, NULL, 0, NULL, 0, 300, 0, 'Bank Account', 300, 'OFFLINE', NULL),
(137, '13426295', '2026-04-13 10:03:20', 300.00, 'COMPLETED', 129, '2026-04-13 10:03:20', '2026-04-13 10:03:20', NULL, 2, NULL, 0, NULL, 0, 300, 0, 'Nagad', 300, 'ONLINE', NULL),
(138, '13426296', '2026-04-13 10:16:39', 1600.00, 'COMPLETED', 130, '2026-04-13 10:16:39', '2026-04-13 10:16:39', NULL, 2, NULL, 0, NULL, 100, 1600, 0, 'Cash On Delivery', 1500, 'OFFLINE', NULL),
(139, '13426297', '2026-04-13 10:17:31', 300.00, 'COMPLETED', 131, '2026-04-13 10:17:31', '2026-04-13 10:17:31', NULL, 2, NULL, 0, NULL, 0, 300, 0, 'Cash', 300, 'ONLINE', NULL),
(140, '15426299', '2026-04-15 08:15:48', 1500.00, 'COMPLETED', 132, '2026-04-15 08:15:48', '2026-04-15 08:15:48', NULL, 2, NULL, 0, NULL, 0, NULL, NULL, NULL, 1500, 'OFFLINE', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED DEFAULT NULL,
  `product_id` bigint(20) UNSIGNED DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `price` float(8,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `barcode` varchar(255) DEFAULT NULL,
  `cogs` int(11) DEFAULT NULL,
  `color_id` int(10) UNSIGNED DEFAULT NULL,
  `size_id` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `price`, `created_at`, `updated_at`, `barcode`, `cogs`, `color_id`, `size_id`) VALUES
(30, 1, 1, 1, 79.99, '2025-12-11 08:14:36', '2025-12-11 08:14:36', NULL, NULL, NULL, NULL),
(31, 1, 2, 2, 12.99, '2025-12-11 08:14:36', '2025-12-11 08:14:36', NULL, NULL, NULL, NULL),
(32, 1, 3, 1, 49.99, '2025-12-11 08:14:36', '2025-12-11 08:14:36', NULL, NULL, NULL, NULL),
(33, 2, 4, 1, 129.99, '2025-12-11 08:14:36', '2025-12-11 08:14:36', NULL, NULL, NULL, NULL),
(35, 3, 6, 1, 69.99, '2025-12-11 08:14:36', '2025-12-11 08:14:36', NULL, NULL, NULL, NULL),
(36, 3, 7, 1, 99.99, '2025-12-11 08:14:36', '2025-12-11 08:14:36', NULL, NULL, NULL, NULL),
(37, 4, 8, 2, 34.99, '2025-12-11 08:14:36', '2025-12-11 08:14:36', NULL, NULL, NULL, NULL),
(38, 5, 9, 1, 199.99, '2025-12-11 08:14:36', '2025-12-11 08:14:36', NULL, NULL, NULL, NULL),
(39, 5, 10, 1, 59.99, '2025-12-11 08:14:36', '2025-12-11 08:14:36', NULL, NULL, NULL, NULL),
(40, 6, 1, 1, 79.99, '2025-12-11 08:14:36', '2025-12-11 08:14:36', NULL, NULL, NULL, NULL),
(41, 7, 2, 2, 12.99, '2025-12-11 08:14:36', '2025-12-11 08:14:36', NULL, NULL, NULL, NULL),
(42, 8, 3, 1, 49.99, '2025-12-11 08:14:36', '2025-12-11 08:14:36', NULL, NULL, NULL, NULL),
(43, 8, 4, 1, 129.99, '2025-12-11 08:14:36', '2025-12-11 08:14:36', NULL, NULL, NULL, NULL),
(139, 106, 38, 6, 9000.00, '2026-04-05 06:22:22', '2026-04-05 07:17:01', '380103', 1200, 1, 3),
(140, 107, 38, 1, 1500.00, '2026-04-05 07:02:11', '2026-04-05 07:02:11', '380103', 1200, 1, 3),
(141, 108, 38, 1, 1500.00, '2026-04-05 07:02:57', '2026-04-05 07:02:57', '380103', 1200, 1, 3),
(142, 106, 37, 3, 900.00, '2026-04-05 07:11:33', '2026-04-05 07:12:44', '370008', NULL, NULL, 8),
(143, 109, 38, 2, 3000.00, '2026-04-05 07:24:24', '2026-04-07 05:02:08', '380103', 1200, 1, 3),
(145, 111, 38, 1, 1500.00, '2026-04-06 11:00:51', '2026-04-06 11:00:51', '380003', 2, NULL, 3),
(146, 112, 38, 1, 1500.00, '2026-04-06 11:01:26', '2026-04-06 11:01:26', '380003', 2, NULL, 3),
(148, 114, 39, 1, 1200.00, '2026-04-06 11:02:43', '2026-04-06 11:02:43', '390004', 5, NULL, 4),
(149, 115, 37, 1, 300.00, '2026-04-06 12:00:32', '2026-04-06 12:00:32', '370008', 200, NULL, 8),
(150, 116, 37, 1, 300.00, '2026-04-06 12:01:40', '2026-04-06 12:01:40', '370008', 200, NULL, 8),
(151, 117, 37, 1, 300.00, '2026-04-06 12:03:53', '2026-04-06 12:03:53', '370008', 200, NULL, 8),
(152, 118, 38, 1, 1500.00, '2026-04-07 04:55:38', '2026-04-07 04:55:38', '380103', 1200, 1, 3),
(153, 119, 37, 1, 300.00, '2026-04-07 04:57:04', '2026-04-07 04:57:04', '370008', 200, NULL, 8),
(154, 120, 37, 1, 300.00, '2026-04-07 04:59:02', '2026-04-07 04:59:02', '370008', 200, NULL, 8),
(155, 121, 37, 1, 300.00, '2026-04-07 05:21:16', '2026-04-07 05:21:16', '370008', 200, NULL, 8),
(156, 122, 37, 1, 300.00, '2026-04-07 05:24:52', '2026-04-07 05:24:52', '370008', 200, NULL, 8),
(157, 123, 37, 1, 300.00, '2026-04-07 05:25:59', '2026-04-07 05:25:59', '370008', 200, NULL, 8),
(158, 124, 37, 1, 300.00, '2026-04-07 05:27:55', '2026-04-07 05:27:55', '370008', 200, NULL, 8),
(159, 125, 37, 1, 300.00, '2026-04-07 05:34:07', '2026-04-07 05:34:07', '370008', 200, NULL, 8),
(160, 126, 37, 1, 300.00, '2026-04-07 05:38:06', '2026-04-07 05:38:06', '370008', 200, NULL, 8),
(161, 127, 37, 1, 300.00, '2026-04-07 05:38:25', '2026-04-07 05:38:25', '370008', 200, NULL, 8),
(162, 128, 38, 1, 1500.00, '2026-04-07 05:42:58', '2026-04-07 05:42:58', '380103', 1200, 1, 3),
(163, 129, 38, 1, 1500.00, '2026-04-07 05:43:16', '2026-04-07 05:43:16', '380103', 1200, 1, 3),
(164, 130, 37, 1, 300.00, '2026-04-07 06:02:57', '2026-04-07 06:02:57', '370008', 200, NULL, 8),
(165, 131, 37, 1, 300.00, '2026-04-07 06:03:12', '2026-04-07 06:03:12', '370008', 200, NULL, 8),
(166, 132, 37, 1, 300.00, '2026-04-07 09:53:05', '2026-04-07 09:53:05', '370008', 200, NULL, 8),
(167, 133, 37, 1, 300.00, '2026-04-11 05:21:45', '2026-04-11 05:21:45', '370008', 200, NULL, 8),
(168, 134, 38, 1, 1500.00, '2026-04-11 05:22:15', '2026-04-11 05:22:15', '380103', 1200, 1, 3),
(169, 135, 40, 1, 300.00, '2026-04-13 08:45:41', '2026-04-13 08:45:41', '400803', 400, 8, 3),
(170, 136, 40, 1, 300.00, '2026-04-13 08:46:49', '2026-04-13 08:46:49', '400803', 400, 8, 3),
(171, 137, 40, 1, 300.00, '2026-04-13 10:03:20', '2026-04-13 10:03:20', '400501', 500, 5, 1),
(172, 138, 38, 1, 1500.00, '2026-04-13 10:16:39', '2026-04-13 10:16:39', '380103', 1200, 1, 3),
(173, 139, 40, 1, 300.00, '2026-04-13 10:17:31', '2026-04-13 10:17:31', '400501', 500, 5, 1),
(174, 140, 38, 1, 1500.00, '2026-04-15 08:15:48', '2026-04-15 08:15:48', '380103', 1200, 1, 3);

-- --------------------------------------------------------

--
-- Table structure for table `order_serials`
--

CREATE TABLE `order_serials` (
  `id` int(10) UNSIGNED NOT NULL,
  `serial` bigint(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_serials`
--

INSERT INTO `order_serials` (`id`, `serial`, `created_at`, `updated_at`) VALUES
(1, 1, '2025-11-05 09:18:49', '2025-11-05 09:18:49'),
(2, 2, '2025-11-05 09:40:47', '2025-11-05 09:40:47'),
(3, 3, '2025-11-05 10:01:10', '2025-11-05 10:01:10'),
(4, 4, '2025-11-05 10:08:30', '2025-11-05 10:08:30'),
(5, 5, '2025-11-05 10:39:55', '2025-11-05 10:39:55'),
(6, 6, '2025-11-05 10:40:37', '2025-11-05 10:40:37'),
(7, 7, '2025-11-05 12:11:47', '2025-11-05 12:11:47'),
(8, 8, '2025-11-05 12:13:02', '2025-11-05 12:13:02'),
(9, 9, '2025-11-05 12:13:53', '2025-11-05 12:13:53'),
(10, 10, '2025-11-05 13:02:23', '2025-11-05 13:02:23'),
(11, 11, '2025-11-06 10:19:52', '2025-11-06 10:19:52'),
(12, 12, '2025-11-06 10:33:37', '2025-11-06 10:33:37'),
(13, 13, '2025-11-06 10:34:02', '2025-11-06 10:34:02'),
(14, 14, '2025-11-06 10:34:27', '2025-11-06 10:34:27'),
(15, 15, '2025-11-06 10:35:02', '2025-11-06 10:35:02'),
(16, 16, '2025-11-06 10:35:48', '2025-11-06 10:35:48'),
(17, 17, '2025-11-06 10:36:44', '2025-11-06 10:36:44'),
(18, 18, '2025-11-06 10:37:43', '2025-11-06 10:37:43'),
(19, 19, '2025-11-06 10:38:51', '2025-11-06 10:38:51'),
(20, 20, '2025-11-06 10:43:50', '2025-11-06 10:43:50'),
(21, 21, '2025-11-06 10:44:53', '2025-11-06 10:44:53'),
(22, 22, '2025-11-06 10:45:37', '2025-11-06 10:45:37'),
(23, 23, '2025-11-06 10:47:00', '2025-11-06 10:47:00'),
(24, 24, '2025-11-06 10:51:57', '2025-11-06 10:51:57'),
(25, 25, '2025-11-06 11:00:53', '2025-11-06 11:00:53'),
(26, 26, '2025-11-06 11:00:55', '2025-11-06 11:00:55'),
(27, 27, '2025-11-06 11:43:31', '2025-11-06 11:43:31'),
(28, 28, '2025-11-06 11:44:52', '2025-11-06 11:44:52'),
(29, 29, '2025-11-06 11:47:52', '2025-11-06 11:47:52'),
(30, 30, '2025-11-06 11:50:09', '2025-11-06 11:50:09'),
(31, 31, '2025-11-06 11:50:17', '2025-11-06 11:50:17'),
(32, 32, '2026-02-25 04:05:38', '2026-02-25 04:05:38'),
(33, 33, '2026-02-25 04:15:26', '2026-02-25 04:15:26'),
(34, 34, '2026-02-25 04:31:28', '2026-02-25 04:31:28'),
(35, 35, '2026-02-25 04:32:46', '2026-02-25 04:32:46'),
(36, 36, '2026-02-25 04:35:46', '2026-02-25 04:35:46'),
(37, 37, '2026-02-25 04:36:10', '2026-02-25 04:36:10'),
(38, 38, '2026-02-25 04:36:55', '2026-02-25 04:36:55'),
(39, 39, '2026-02-25 04:38:42', '2026-02-25 04:38:42'),
(40, 40, '2026-02-25 04:38:49', '2026-02-25 04:38:49'),
(41, 41, '2026-02-25 08:52:19', '2026-02-25 08:52:19'),
(42, 42, '2026-02-25 08:52:31', '2026-02-25 08:52:31'),
(43, 43, '2026-02-25 08:53:11', '2026-02-25 08:53:11'),
(44, 44, '2026-02-25 08:53:18', '2026-02-25 08:53:18'),
(45, 45, '2026-02-25 09:03:35', '2026-02-25 09:03:35'),
(46, 46, '2026-02-25 09:08:13', '2026-02-25 09:08:13'),
(47, 47, '2026-02-25 09:08:18', '2026-02-25 09:08:18'),
(48, 48, '2026-02-25 09:13:43', '2026-02-25 09:13:43'),
(49, 49, '2026-02-25 09:13:48', '2026-02-25 09:13:48'),
(50, 50, '2026-02-25 09:13:51', '2026-02-25 09:13:51'),
(51, 51, '2026-02-25 09:21:20', '2026-02-25 09:21:20'),
(52, 52, '2026-02-25 09:42:15', '2026-02-25 09:42:15'),
(53, 53, '2026-02-25 09:42:29', '2026-02-25 09:42:29'),
(54, 54, '2026-02-25 09:42:53', '2026-02-25 09:42:53'),
(55, 55, '2026-02-25 09:43:38', '2026-02-25 09:43:38'),
(56, 56, '2026-02-25 09:44:03', '2026-02-25 09:44:03'),
(57, 57, '2026-02-25 09:45:55', '2026-02-25 09:45:55'),
(58, 58, '2026-02-25 09:46:28', '2026-02-25 09:46:28'),
(59, 59, '2026-02-25 09:46:31', '2026-02-25 09:46:31'),
(60, 60, '2026-02-25 09:46:33', '2026-02-25 09:46:33'),
(61, 61, '2026-02-25 10:08:20', '2026-02-25 10:08:20'),
(62, 62, '2026-02-25 10:35:15', '2026-02-25 10:35:15'),
(63, 63, '2026-02-25 10:36:09', '2026-02-25 10:36:09'),
(64, 64, '2026-02-26 04:15:17', '2026-02-26 04:15:17'),
(65, 65, '2026-02-26 04:18:21', '2026-02-26 04:18:21'),
(66, 66, '2026-02-26 04:19:08', '2026-02-26 04:19:08'),
(67, 67, '2026-02-26 05:15:15', '2026-02-26 05:15:15'),
(68, 68, '2026-02-26 05:15:17', '2026-02-26 05:15:17'),
(69, 69, '2026-02-26 05:15:20', '2026-02-26 05:15:20'),
(70, 70, '2026-02-26 05:15:21', '2026-02-26 05:15:21'),
(71, 71, '2026-02-26 05:15:23', '2026-02-26 05:15:23'),
(72, 72, '2026-02-26 05:22:01', '2026-02-26 05:22:01'),
(73, 73, '2026-02-26 05:22:07', '2026-02-26 05:22:07'),
(74, 74, '2026-02-26 05:22:08', '2026-02-26 05:22:08'),
(75, 75, '2026-02-26 05:22:17', '2026-02-26 05:22:17'),
(76, 76, '2026-02-26 06:01:31', '2026-02-26 06:01:31'),
(77, 77, '2026-02-26 06:01:32', '2026-02-26 06:01:32'),
(78, 78, '2026-02-26 06:01:33', '2026-02-26 06:01:33'),
(79, 79, '2026-02-26 06:01:34', '2026-02-26 06:01:34'),
(80, 80, '2026-02-26 06:01:36', '2026-02-26 06:01:36'),
(81, 81, '2026-02-26 06:22:24', '2026-02-26 06:22:24'),
(82, 82, '2026-02-26 06:22:25', '2026-02-26 06:22:25'),
(83, 83, '2026-02-26 06:22:29', '2026-02-26 06:22:29'),
(84, 84, '2026-02-26 06:22:34', '2026-02-26 06:22:34'),
(85, 85, '2026-03-07 05:54:12', '2026-03-07 05:54:12'),
(86, 86, '2026-03-07 05:54:16', '2026-03-07 05:54:16'),
(87, 87, '2026-03-07 05:54:20', '2026-03-07 05:54:20'),
(88, 88, '2026-03-07 06:05:57', '2026-03-07 06:05:57'),
(89, 89, '2026-03-07 06:08:28', '2026-03-07 06:08:28'),
(90, 90, '2026-03-07 06:08:33', '2026-03-07 06:08:33'),
(91, 91, '2026-03-07 08:37:45', '2026-03-07 08:37:45'),
(92, 92, '2026-03-07 08:37:50', '2026-03-07 08:37:50'),
(93, 93, '2026-03-07 08:42:38', '2026-03-07 08:42:38'),
(94, 94, '2026-03-07 08:42:39', '2026-03-07 08:42:39'),
(95, 95, '2026-03-07 08:43:01', '2026-03-07 08:43:01'),
(96, 96, '2026-03-07 08:43:01', '2026-03-07 08:43:01'),
(97, 97, '2026-03-07 08:43:14', '2026-03-07 08:43:14'),
(98, 98, '2026-03-07 08:43:14', '2026-03-07 08:43:14'),
(99, 99, '2026-03-07 08:43:27', '2026-03-07 08:43:27'),
(100, 100, '2026-03-07 08:43:27', '2026-03-07 08:43:27'),
(101, 101, '2026-03-07 08:43:37', '2026-03-07 08:43:37'),
(102, 102, '2026-03-07 08:43:37', '2026-03-07 08:43:37'),
(103, 103, '2026-03-07 08:48:54', '2026-03-07 08:48:54'),
(104, 104, '2026-03-07 08:48:54', '2026-03-07 08:48:54'),
(105, 105, '2026-03-07 08:49:54', '2026-03-07 08:49:54'),
(106, 106, '2026-03-07 08:49:54', '2026-03-07 08:49:54'),
(107, 107, '2026-03-07 08:50:01', '2026-03-07 08:50:01'),
(108, 108, '2026-03-07 08:50:01', '2026-03-07 08:50:01'),
(109, 109, '2026-03-07 08:55:49', '2026-03-07 08:55:49'),
(110, 110, '2026-03-07 08:55:49', '2026-03-07 08:55:49'),
(111, 111, '2026-03-07 08:55:58', '2026-03-07 08:55:58'),
(112, 112, '2026-03-07 08:55:58', '2026-03-07 08:55:58'),
(113, 113, '2026-03-07 09:13:03', '2026-03-07 09:13:03'),
(114, 114, '2026-03-07 09:13:03', '2026-03-07 09:13:03'),
(115, 115, '2026-03-07 09:15:08', '2026-03-07 09:15:08'),
(116, 116, '2026-03-07 09:15:08', '2026-03-07 09:15:08'),
(117, 117, '2026-03-07 09:18:13', '2026-03-07 09:18:13'),
(118, 118, '2026-03-07 09:18:13', '2026-03-07 09:18:13'),
(119, 119, '2026-03-07 09:18:19', '2026-03-07 09:18:19'),
(120, 120, '2026-03-07 09:18:19', '2026-03-07 09:18:19'),
(121, 121, '2026-03-07 09:33:22', '2026-03-07 09:33:22'),
(122, 122, '2026-03-07 09:34:19', '2026-03-07 09:34:19'),
(123, 123, '2026-03-07 09:34:20', '2026-03-07 09:34:20'),
(124, 124, '2026-03-07 09:34:45', '2026-03-07 09:34:45'),
(125, 125, '2026-03-07 09:34:46', '2026-03-07 09:34:46'),
(126, 126, '2026-03-07 09:35:17', '2026-03-07 09:35:17'),
(127, 127, '2026-03-07 09:35:17', '2026-03-07 09:35:17'),
(128, 128, '2026-03-07 09:35:31', '2026-03-07 09:35:31'),
(129, 129, '2026-03-07 09:35:32', '2026-03-07 09:35:32'),
(130, 130, '2026-03-07 09:35:48', '2026-03-07 09:35:48'),
(131, 131, '2026-03-07 09:35:48', '2026-03-07 09:35:48'),
(132, 132, '2026-03-07 09:39:56', '2026-03-07 09:39:56'),
(133, 133, '2026-03-07 09:39:56', '2026-03-07 09:39:56'),
(134, 134, '2026-03-07 09:40:17', '2026-03-07 09:40:17'),
(135, 135, '2026-03-07 09:40:17', '2026-03-07 09:40:17'),
(136, 136, '2026-03-07 09:40:35', '2026-03-07 09:40:35'),
(137, 137, '2026-03-07 09:40:35', '2026-03-07 09:40:35'),
(138, 138, '2026-03-07 09:41:08', '2026-03-07 09:41:08'),
(139, 139, '2026-03-07 09:41:08', '2026-03-07 09:41:08'),
(140, 140, '2026-03-07 09:41:10', '2026-03-07 09:41:10'),
(141, 141, '2026-03-07 09:41:10', '2026-03-07 09:41:10'),
(142, 142, '2026-03-07 09:42:12', '2026-03-07 09:42:12'),
(143, 143, '2026-03-07 09:42:12', '2026-03-07 09:42:12'),
(144, 144, '2026-03-07 09:42:22', '2026-03-07 09:42:22'),
(145, 145, '2026-03-07 09:42:22', '2026-03-07 09:42:22'),
(146, 146, '2026-03-07 09:42:30', '2026-03-07 09:42:30'),
(147, 147, '2026-03-07 09:42:30', '2026-03-07 09:42:30'),
(148, 148, '2026-03-07 09:44:45', '2026-03-07 09:44:45'),
(149, 149, '2026-03-07 09:46:44', '2026-03-07 09:46:44'),
(150, 150, '2026-03-07 09:47:39', '2026-03-07 09:47:39'),
(151, 151, '2026-03-07 09:50:15', '2026-03-07 09:50:15'),
(152, 152, '2026-03-07 09:50:25', '2026-03-07 09:50:25'),
(153, 153, '2026-03-07 09:56:28', '2026-03-07 09:56:28'),
(154, 154, '2026-03-07 09:57:06', '2026-03-07 09:57:06'),
(155, 155, '2026-03-07 09:57:19', '2026-03-07 09:57:19'),
(156, 156, '2026-03-07 09:57:25', '2026-03-07 09:57:25'),
(157, 157, '2026-03-07 09:57:46', '2026-03-07 09:57:46'),
(158, 158, '2026-03-07 09:57:46', '2026-03-07 09:57:46'),
(159, 159, '2026-03-07 09:58:09', '2026-03-07 09:58:09'),
(160, 160, '2026-03-07 09:58:09', '2026-03-07 09:58:09'),
(161, 161, '2026-03-07 10:00:20', '2026-03-07 10:00:20'),
(162, 162, '2026-03-07 10:00:20', '2026-03-07 10:00:20'),
(163, 163, '2026-03-07 10:00:50', '2026-03-07 10:00:50'),
(164, 164, '2026-03-07 10:00:50', '2026-03-07 10:00:50'),
(165, 165, '2026-03-07 10:00:52', '2026-03-07 10:00:52'),
(166, 166, '2026-03-07 10:00:56', '2026-03-07 10:00:56'),
(167, 167, '2026-03-07 10:00:56', '2026-03-07 10:00:56'),
(168, 168, '2026-03-07 10:01:00', '2026-03-07 10:01:00'),
(169, 169, '2026-03-07 10:01:04', '2026-03-07 10:01:04'),
(170, 170, '2026-03-07 10:01:04', '2026-03-07 10:01:04'),
(171, 171, '2026-03-07 10:01:30', '2026-03-07 10:01:30'),
(172, 172, '2026-03-07 10:01:54', '2026-03-07 10:01:54'),
(173, 173, '2026-03-07 10:02:11', '2026-03-07 10:02:11'),
(174, 174, '2026-03-07 10:02:11', '2026-03-07 10:02:11'),
(175, 175, '2026-03-07 10:06:29', '2026-03-07 10:06:29'),
(176, 176, '2026-03-07 10:06:29', '2026-03-07 10:06:29'),
(177, 177, '2026-03-07 10:06:30', '2026-03-07 10:06:30'),
(178, 178, '2026-03-07 10:06:37', '2026-03-07 10:06:37'),
(179, 179, '2026-03-07 10:07:31', '2026-03-07 10:07:31'),
(180, 180, '2026-03-07 10:07:34', '2026-03-07 10:07:34'),
(181, 181, '2026-03-07 10:07:40', '2026-03-07 10:07:40'),
(182, 182, '2026-03-07 10:09:46', '2026-03-07 10:09:46'),
(183, 183, '2026-03-07 10:09:46', '2026-03-07 10:09:46'),
(184, 184, '2026-03-07 10:12:33', '2026-03-07 10:12:33'),
(185, 185, '2026-03-07 10:12:35', '2026-03-07 10:12:35'),
(186, 186, '2026-03-07 10:12:38', '2026-03-07 10:12:38'),
(187, 187, '2026-03-07 10:12:43', '2026-03-07 10:12:43'),
(188, 188, '2026-03-07 10:15:23', '2026-03-07 10:15:23'),
(189, 189, '2026-03-07 10:15:23', '2026-03-07 10:15:23'),
(190, 190, '2026-03-07 10:16:13', '2026-03-07 10:16:13'),
(191, 191, '2026-03-07 10:16:13', '2026-03-07 10:16:13'),
(192, 192, '2026-03-07 10:16:16', '2026-03-07 10:16:16'),
(193, 193, '2026-03-07 10:20:07', '2026-03-07 10:20:07'),
(194, 194, '2026-03-07 10:20:07', '2026-03-07 10:20:07'),
(195, 195, '2026-03-07 10:20:32', '2026-03-07 10:20:32'),
(196, 196, '2026-03-07 10:20:32', '2026-03-07 10:20:32'),
(197, 197, '2026-03-07 10:20:45', '2026-03-07 10:20:45'),
(198, 198, '2026-03-07 10:20:45', '2026-03-07 10:20:45'),
(199, 199, '2026-03-07 10:20:55', '2026-03-07 10:20:55'),
(200, 200, '2026-03-07 10:22:57', '2026-03-07 10:22:57'),
(201, 201, '2026-03-07 10:25:06', '2026-03-07 10:25:06'),
(202, 202, '2026-03-07 10:25:41', '2026-03-07 10:25:41'),
(203, 203, '2026-03-07 10:27:22', '2026-03-07 10:27:22'),
(204, 204, '2026-03-07 10:27:23', '2026-03-07 10:27:23'),
(205, 205, '2026-03-07 10:27:28', '2026-03-07 10:27:28'),
(206, 206, '2026-03-07 10:27:29', '2026-03-07 10:27:29'),
(207, 207, '2026-03-07 10:27:37', '2026-03-07 10:27:37'),
(208, 208, '2026-03-07 10:27:37', '2026-03-07 10:27:37'),
(209, 209, '2026-03-07 10:28:10', '2026-03-07 10:28:10'),
(210, 210, '2026-03-07 10:28:10', '2026-03-07 10:28:10'),
(211, 211, '2026-03-07 10:28:16', '2026-03-07 10:28:16'),
(212, 212, '2026-03-07 10:28:16', '2026-03-07 10:28:16'),
(213, 213, '2026-03-07 10:28:26', '2026-03-07 10:28:26'),
(214, 214, '2026-03-07 10:28:26', '2026-03-07 10:28:26'),
(215, 215, '2026-03-08 04:08:34', '2026-03-08 04:08:34'),
(216, 216, '2026-03-08 04:08:41', '2026-03-08 04:08:41'),
(217, 217, '2026-03-08 04:09:39', '2026-03-08 04:09:39'),
(218, 218, '2026-03-08 04:17:52', '2026-03-08 04:17:52'),
(219, 219, '2026-03-08 04:17:52', '2026-03-08 04:17:52'),
(220, 220, '2026-03-08 04:17:58', '2026-03-08 04:17:58'),
(221, 221, '2026-03-08 04:17:58', '2026-03-08 04:17:58'),
(222, 222, '2026-03-08 04:20:04', '2026-03-08 04:20:04'),
(223, 223, '2026-03-08 04:20:04', '2026-03-08 04:20:04'),
(224, 224, '2026-03-08 05:32:18', '2026-03-08 05:32:18'),
(225, 225, '2026-03-08 05:32:18', '2026-03-08 05:32:18'),
(226, 226, '2026-03-08 05:54:45', '2026-03-08 05:54:45'),
(227, 227, '2026-03-08 05:54:45', '2026-03-08 05:54:45'),
(228, 228, '2026-04-02 05:38:54', '2026-04-02 05:38:54'),
(229, 229, '2026-04-02 05:39:27', '2026-04-02 05:39:27'),
(230, 230, '2026-04-02 05:40:36', '2026-04-02 05:40:36'),
(231, 231, '2026-04-02 05:42:39', '2026-04-02 05:42:39'),
(232, 232, '2026-04-02 05:42:39', '2026-04-02 05:42:39'),
(233, 233, '2026-04-02 05:46:35', '2026-04-02 05:46:35'),
(234, 234, '2026-04-02 05:46:35', '2026-04-02 05:46:35'),
(235, 235, '2026-04-02 05:54:57', '2026-04-02 05:54:57'),
(236, 236, '2026-04-02 05:54:57', '2026-04-02 05:54:57'),
(237, 237, '2026-04-02 05:59:37', '2026-04-02 05:59:37'),
(238, 238, '2026-04-02 05:59:37', '2026-04-02 05:59:37'),
(239, 239, '2026-04-02 06:00:05', '2026-04-02 06:00:05'),
(240, 240, '2026-04-02 06:00:05', '2026-04-02 06:00:05'),
(241, 241, '2026-04-02 06:02:34', '2026-04-02 06:02:34'),
(242, 242, '2026-04-02 06:02:34', '2026-04-02 06:02:34'),
(243, 243, '2026-04-02 06:03:52', '2026-04-02 06:03:52'),
(244, 244, '2026-04-02 06:03:52', '2026-04-02 06:03:52'),
(245, 245, '2026-04-02 06:33:22', '2026-04-02 06:33:22'),
(246, 246, '2026-04-02 06:33:35', '2026-04-02 06:33:35'),
(247, 247, '2026-04-05 06:03:36', '2026-04-05 06:03:36'),
(248, 248, '2026-04-05 06:04:39', '2026-04-05 06:04:39'),
(249, 249, '2026-04-05 06:19:18', '2026-04-05 06:19:18'),
(250, 250, '2026-04-05 06:22:12', '2026-04-05 06:22:12'),
(251, 251, '2026-04-05 06:52:07', '2026-04-05 06:52:07'),
(252, 252, '2026-04-05 06:52:13', '2026-04-05 06:52:13'),
(253, 253, '2026-04-05 07:02:48', '2026-04-05 07:02:48'),
(254, 254, '2026-04-05 07:22:57', '2026-04-05 07:22:57'),
(255, 255, '2026-04-05 07:23:44', '2026-04-05 07:23:44'),
(256, 256, '2026-04-05 07:26:29', '2026-04-05 07:26:29'),
(257, 257, '2026-04-05 07:26:34', '2026-04-05 07:26:34'),
(258, 258, '2026-04-06 10:39:22', '2026-04-06 10:39:22'),
(259, 259, '2026-04-06 11:00:46', '2026-04-06 11:00:46'),
(260, 260, '2026-04-06 11:01:20', '2026-04-06 11:01:20'),
(261, 261, '2026-04-06 11:01:52', '2026-04-06 11:01:52'),
(262, 262, '2026-04-06 11:02:23', '2026-04-06 11:02:23'),
(263, 263, '2026-04-06 12:00:28', '2026-04-06 12:00:28'),
(264, 264, '2026-04-06 12:01:14', '2026-04-06 12:01:14'),
(265, 265, '2026-04-06 12:01:23', '2026-04-06 12:01:23'),
(266, 266, '2026-04-06 12:01:36', '2026-04-06 12:01:36'),
(267, 267, '2026-04-06 12:03:48', '2026-04-06 12:03:48'),
(268, 268, '2026-04-07 04:55:27', '2026-04-07 04:55:27'),
(269, 269, '2026-04-07 04:56:56', '2026-04-07 04:56:56'),
(270, 270, '2026-04-07 04:58:55', '2026-04-07 04:58:55'),
(271, 271, '2026-04-07 05:01:05', '2026-04-07 05:01:05'),
(272, 272, '2026-04-07 05:02:17', '2026-04-07 05:02:17'),
(273, 273, '2026-04-07 05:02:19', '2026-04-07 05:02:19'),
(274, 274, '2026-04-07 05:12:30', '2026-04-07 05:12:30'),
(275, 275, '2026-04-07 05:21:12', '2026-04-07 05:21:12'),
(276, 276, '2026-04-07 05:24:47', '2026-04-07 05:24:47'),
(277, 277, '2026-04-07 05:25:56', '2026-04-07 05:25:56'),
(278, 278, '2026-04-07 05:27:48', '2026-04-07 05:27:48'),
(279, 279, '2026-04-07 05:34:02', '2026-04-07 05:34:02'),
(280, 280, '2026-04-07 05:38:02', '2026-04-07 05:38:02'),
(281, 281, '2026-04-07 05:38:21', '2026-04-07 05:38:21'),
(282, 282, '2026-04-07 05:42:53', '2026-04-07 05:42:53'),
(283, 283, '2026-04-07 05:43:09', '2026-04-07 05:43:09'),
(284, 284, '2026-04-07 05:43:12', '2026-04-07 05:43:12'),
(285, 285, '2026-04-07 06:02:54', '2026-04-07 06:02:54'),
(286, 286, '2026-04-07 06:03:09', '2026-04-07 06:03:09'),
(287, 287, '2026-04-07 09:53:01', '2026-04-07 09:53:01'),
(288, 288, '2026-04-11 05:21:37', '2026-04-11 05:21:37'),
(289, 289, '2026-04-11 05:21:58', '2026-04-11 05:21:58'),
(290, 290, '2026-04-13 08:15:25', '2026-04-13 08:15:25'),
(291, 291, '2026-04-13 08:22:00', '2026-04-13 08:22:00'),
(292, 292, '2026-04-13 08:29:56', '2026-04-13 08:29:56'),
(293, 293, '2026-04-13 08:45:34', '2026-04-13 08:45:34'),
(294, 294, '2026-04-13 08:46:40', '2026-04-13 08:46:40'),
(295, 295, '2026-04-13 10:01:35', '2026-04-13 10:01:35'),
(296, 296, '2026-04-13 10:15:07', '2026-04-13 10:15:07'),
(297, 297, '2026-04-13 10:17:23', '2026-04-13 10:17:23'),
(298, 298, '2026-04-15 08:14:40', '2026-04-15 08:14:40'),
(299, 299, '2026-04-15 08:15:46', '2026-04-15 08:15:46'),
(300, 300, '2026-04-16 05:37:11', '2026-04-16 05:37:11'),
(301, 301, '2026-04-16 05:37:11', '2026-04-16 05:37:11');

-- --------------------------------------------------------

--
-- Table structure for table `payment_methods`
--

CREATE TABLE `payment_methods` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment_methods`
--

INSERT INTO `payment_methods` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'bkash', '2025-11-05 13:00:46', '2025-11-05 13:00:46'),
(2, 'Nagad', '2025-11-05 13:00:54', '2025-11-05 13:00:54'),
(3, 'Bank Account', '2025-11-05 13:01:01', '2025-11-05 13:01:01'),
(4, 'Cash On Delivery', '2025-11-05 13:01:12', '2025-11-05 13:01:12'),
(7, 'Cash', '2026-04-05 06:50:11', '2026-04-05 06:50:11');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `sku` varchar(255) DEFAULT NULL,
  `selling_price` float(8,2) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `category_id` int(10) UNSIGNED DEFAULT NULL,
  `brand_id` int(10) UNSIGNED DEFAULT NULL,
  `image_id` int(10) UNSIGNED DEFAULT NULL,
  `lc_number` varchar(255) DEFAULT NULL,
  `barcode` varchar(64) DEFAULT NULL,
  `barcode_serial_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `sku`, `selling_price`, `description`, `created_at`, `updated_at`, `category_id`, `brand_id`, `image_id`, `lc_number`, `barcode`, `barcode_serial_id`) VALUES
(37, 'Mustered Oil', 'MO1', 300.00, '<p>Organic Mustered Oil</p>', '2026-04-05 05:58:42', '2026-04-05 05:58:42', 8, NULL, NULL, NULL, NULL, NULL),
(38, 'Shirt', 'ST1', 1500.00, '', '2026-04-05 06:21:36', '2026-04-05 06:21:36', 4, 1, NULL, NULL, NULL, NULL),
(39, 'product 4', 'WH-03', 1200.00, '<p>dfgdfgdfgdfgdfgdfgdfgdfgdfg</p>', '2026-04-06 10:37:23', '2026-04-06 10:37:23', 3, 5, 25, NULL, NULL, NULL),
(40, 'test', 'WH-05', 300.00, '', '2026-04-13 08:17:31', '2026-04-13 08:17:31', 4, 8, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `products_colors`
--

CREATE TABLE `products_colors` (
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `color_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products_colors`
--

INSERT INTO `products_colors` (`product_id`, `color_id`) VALUES
(38, 1),
(38, 2),
(38, 4),
(38, 6),
(38, 7),
(40, 4),
(40, 5),
(40, 8),
(40, 9);

-- --------------------------------------------------------

--
-- Table structure for table `products_sizes`
--

CREATE TABLE `products_sizes` (
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `size_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products_sizes`
--

INSERT INTO `products_sizes` (`product_id`, `size_id`) VALUES
(37, 8),
(38, 2),
(38, 3),
(38, 4),
(38, 5),
(39, 4),
(40, 1),
(40, 3),
(40, 4),
(40, 8);

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED DEFAULT NULL,
  `branch_id` int(10) UNSIGNED DEFAULT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `customer_id` int(10) UNSIGNED DEFAULT NULL,
  `customer_phone` varchar(255) DEFAULT NULL,
  `total_amount` float(8,2) NOT NULL,
  `cost_of_goods_sold` float(8,2) DEFAULT NULL,
  `vat` float(8,2) DEFAULT NULL,
  `action` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_token` varchar(255) NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `expires` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(10) UNSIGNED NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` text NOT NULL,
  `type` enum('number','text','image','json') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `settings_data`
--

CREATE TABLE `settings_data` (
  `id` int(10) UNSIGNED NOT NULL,
  `return_privacy_policy` text DEFAULT NULL,
  `logo_image_url` varchar(255) DEFAULT NULL,
  `login_image_url` varchar(255) DEFAULT NULL,
  `vat_rate` decimal(5,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `settings_data`
--

INSERT INTO `settings_data` (`id`, `return_privacy_policy`, `logo_image_url`, `login_image_url`, `vat_rate`, `created_at`, `updated_at`) VALUES
(8, '', '/images/logo/logo-ujmpi-1775371115866.avif', '/images/login/login-vmzg3-1775371115920.jpg', 0.00, '2026-04-05 06:38:35', '2026-04-05 06:38:35');

-- --------------------------------------------------------

--
-- Table structure for table `sizes`
--

CREATE TABLE `sizes` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sizes`
--

INSERT INTO `sizes` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'LX', '2025-11-05 13:04:56', '2025-11-05 13:04:56'),
(2, 'Small', '2025-12-11 06:59:49', '2025-12-11 06:59:49'),
(3, 'Medium', '2025-12-11 06:59:49', '2025-12-11 06:59:49'),
(4, 'Large', '2025-12-11 06:59:49', '2025-12-11 06:59:49'),
(5, 'Extra Large', '2025-12-11 06:59:49', '2025-12-11 06:59:49'),
(6, 'XXL', '2025-12-11 06:59:49', '2025-12-11 06:59:49'),
(7, 'One Size', '2025-12-11 06:59:49', '2025-12-11 06:59:49'),
(8, 'Litter', '2026-04-05 05:58:20', '2026-04-05 05:58:20');

-- --------------------------------------------------------

--
-- Table structure for table `stocks`
--

CREATE TABLE `stocks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED DEFAULT NULL,
  `branch_id` int(10) UNSIGNED NOT NULL DEFAULT 1,
  `barcode` varchar(255) NOT NULL,
  `color_id` int(10) UNSIGNED DEFAULT NULL,
  `size_id` int(10) UNSIGNED DEFAULT NULL,
  `cost` float(8,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `sell_count` int(11) DEFAULT 0,
  `condition` enum('new','damaged') DEFAULT 'new',
  `quantity` int(11) DEFAULT NULL,
  `product_date` date DEFAULT NULL,
  `shelf_life` int(11) DEFAULT NULL,
  `expire_date` date DEFAULT NULL,
  `supplier_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stocks`
--

INSERT INTO `stocks` (`id`, `product_id`, `branch_id`, `barcode`, `color_id`, `size_id`, `cost`, `created_at`, `updated_at`, `sell_count`, `condition`, `quantity`, `product_date`, `shelf_life`, `expire_date`, `supplier_name`) VALUES
(31, NULL, 4, '170000', NULL, NULL, 0.00, '2025-12-11 07:46:45', '2025-12-11 07:46:45', 0, 'new', 0, NULL, NULL, NULL, NULL),
(45, 37, 2, '370008', NULL, 8, 200.00, '2026-04-05 06:00:14', '2026-04-11 05:21:45', 0, 'new', 981, NULL, NULL, NULL, NULL),
(46, 38, 2, '380103', 1, 3, 1200.00, '2026-04-05 06:22:04', '2026-04-15 08:15:48', 0, 'new', 84, NULL, NULL, NULL, NULL),
(49, 40, 2, '400803', 8, 3, 400.00, '2026-04-13 08:21:56', '2026-04-13 08:46:49', 0, 'new', 48, '2026-04-13', 60, '2026-06-12', NULL),
(50, 40, 2, '400501', 5, 1, 350.00, '2026-04-13 10:01:23', '2026-04-13 10:19:03', 0, 'new', 16, '2026-04-13', 200, '2026-10-30', 'Abu Raihan'),
(51, 40, 2, '400503', 5, 3, 100.00, '2026-04-13 10:05:45', '2026-04-13 10:05:45', 0, 'new', 50, '2026-04-13', 100, '2026-07-22', 'Abu Raihan'),
(52, 40, 2, '400501', 5, 1, 120.00, '2026-04-13 10:24:37', '2026-04-13 10:24:37', 0, 'new', 12, '2026-04-13', 10, '2026-04-23', 'Anik'),
(53, 40, 2, '400808', 8, 8, 15.00, '2026-04-13 12:11:13', '2026-04-13 12:11:13', 0, 'new', 15, '2026-04-13', 60, '2026-06-12', 'Anik'),
(54, 40, 2, '400404', 4, 4, 200.00, '2026-04-15 04:28:50', '2026-04-15 04:28:50', 0, 'new', 10, '2025-02-11', 1000, '2027-11-08', 'Anik'),
(55, 40, 2, '400501', 5, 1, 20.00, '2026-04-15 05:22:36', '2026-04-15 05:22:36', 0, 'new', 2, '2222-02-02', 20, '2222-02-22', 'Anik'),
(56, 40, 5, '400503', 5, 3, 200.00, '2026-04-16 05:31:01', '2026-04-16 05:31:01', 0, 'new', 50, '2222-02-22', 150, '2222-07-22', 'Anik');

-- --------------------------------------------------------

--
-- Table structure for table `stock_histories`
--

CREATE TABLE `stock_histories` (
  `id` int(10) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED DEFAULT NULL,
  `barcode` varchar(255) NOT NULL,
  `variant` varchar(255) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `cost_per_item` float(8,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `product_date` date DEFAULT NULL,
  `shelf_life` int(11) DEFAULT NULL,
  `expire_date` date DEFAULT NULL,
  `supplier_name` varchar(255) DEFAULT NULL,
  `paid_amount` float(8,2) DEFAULT NULL,
  `due_amount` float(8,2) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stock_histories`
--

INSERT INTO `stock_histories` (`id`, `product_id`, `barcode`, `variant`, `quantity`, `cost_per_item`, `created_at`, `updated_at`, `product_date`, `shelf_life`, `expire_date`, `supplier_name`, `paid_amount`, `due_amount`, `payment_method`) VALUES
(22, 37, '370008', ' - Litter', 1000, 200.00, '2026-04-05 06:00:14', '2026-04-05 06:00:14', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(23, 38, '380103', 'Black - Medium', 100, 1200.00, '2026-04-05 06:22:04', '2026-04-05 06:22:04', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(24, 39, '390004', ' - Large', 1, 5.00, '2026-04-06 10:37:56', '2026-04-06 10:37:56', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(25, 38, '380003', ' - Medium', 2, 2.00, '2026-04-06 10:38:34', '2026-04-06 10:38:34', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(26, 40, '400803', 'Purple - Medium', 50, 400.00, '2026-04-13 08:21:56', '2026-04-13 08:21:56', '2026-04-13', 60, '2026-06-12', NULL, NULL, NULL, NULL),
(27, 40, '400501', 'Black - LX', 10, 500.00, '2026-04-13 10:01:23', '2026-04-15 08:19:54', '2026-04-13', 20, '2026-05-03', 'Anik', 1000.00, 4000.00, 'Nagad'),
(28, 40, '400503', 'Black - Medium', 50, 100.00, '2026-04-13 10:05:45', '2026-04-13 10:05:45', '2026-04-13', 100, '2026-07-22', 'Abu Raihan', NULL, NULL, NULL),
(29, 40, '400501', 'Black - LX', 8, 200.00, '2026-04-13 10:19:03', '2026-04-15 12:10:13', '2026-04-13', 200, '2026-10-30', 'Abu Raihan', 700.00, 900.00, 'Cash'),
(30, 40, '400501', 'Black - LX', 12, 120.00, '2026-04-13 10:24:37', '2026-04-15 06:56:52', '2026-04-13', 10, '2026-04-23', 'Anik', 1440.00, 0.00, 'Bank Account'),
(31, 40, '400808', 'Purple - Litter', 15, 15.00, '2026-04-13 12:11:13', '2026-04-15 08:14:52', '2026-04-13', 60, '2026-06-12', 'Anik', 225.00, 0.00, 'Cash On Delivery'),
(32, 40, '400404', 'Green - Large', 10, 200.00, '2026-04-15 04:28:50', '2026-04-15 06:56:42', '2025-02-11', 1000, '2027-11-08', 'Anik', 2000.00, 0.00, 'bkash'),
(33, 40, '400501', 'Black - LX', 2, 20.00, '2026-04-15 05:22:36', '2026-04-15 05:22:36', '2222-02-02', 20, '2222-02-22', 'Anik', 40.00, 0.00, NULL),
(34, 40, '400503', 'Black - Medium', 50, 200.00, '2026-04-16 05:31:01', '2026-04-16 05:31:01', '2222-02-22', 150, '2222-07-22', 'Anik', 2000.00, 8000.00, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `suppliers`
--

INSERT INTO `suppliers` (`id`, `name`, `phone`, `address`, `created_at`, `updated_at`, `email`) VALUES
(1, 'Anik', '01744155760', 'Kazipara', '2026-04-13 08:45:09', '2026-04-13 08:45:09', NULL),
(2, 'Abu Raihan', '01860574432', '60 fit road Monipur', '2026-04-13 10:04:58', '2026-04-13 10:04:58', NULL),
(3, 'Test Person2', '017444555666', 'Uttara-10, Dhaka', '2026-04-15 04:30:25', '2026-04-15 04:30:25', 'test@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `supplier_payments`
--

CREATE TABLE `supplier_payments` (
  `id` int(10) UNSIGNED NOT NULL,
  `supplier_id` int(10) UNSIGNED NOT NULL,
  `amount` float(8,2) NOT NULL,
  `payment_method_id` int(10) UNSIGNED DEFAULT NULL,
  `payment_date` date NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tradings`
--

CREATE TABLE `tradings` (
  `id` int(10) UNSIGNED NOT NULL,
  `customer_id` int(10) UNSIGNED DEFAULT NULL,
  `branch_id` int(10) UNSIGNED DEFAULT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `status` enum('PENDING','COMPLETED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `amount` decimal(15,2) NOT NULL DEFAULT 0.00,
  `notes` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email_verified` timestamp NULL DEFAULT NULL,
  `role` enum('ADMIN','STAFF') NOT NULL DEFAULT 'STAFF',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp(),
  `phone` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `email_verified`, `role`, `created_at`, `updated_at`, `phone`) VALUES
(8, 'Abu Raihan', 'raihan.okobiz@gmail.com', '$2a$10$IzcuyX4.A.nQWDJY8KZ9jewKjDqI49llfo86HBFs4LWTEVV2UGqQ2', NULL, 'ADMIN', '2026-04-05 08:55:55', '2026-04-05 08:55:55', '01860574432'),
(9, 'root', 'root@root.com', '$2a$10$uMKbDQX3lwuJHjSaJyfe7eRZ74Y0cZ1yE4OxboycHhcEqrbNTDkCy', NULL, 'ADMIN', '2026-04-05 11:42:56', '2026-04-05 11:42:56', '01744155760'),
(10, 'shamee vai', 'shameem.rml@gmail.com', '$2a$10$FbDvr0xZwV1B6kHqnd91.OsxC64KcgNhYjI8n4ghIBayrwPIrs24K', NULL, 'ADMIN', '2026-04-05 11:43:55', '2026-04-05 11:43:55', '01744155762');

-- --------------------------------------------------------

--
-- Table structure for table `verification_tokens`
--

CREATE TABLE `verification_tokens` (
  `identifier` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`provider`,`provider_account_id`),
  ADD KEY `accounts_user_id_foreign` (`user_id`);

--
-- Indexes for table `barcode_serials`
--
ALTER TABLE `barcode_serials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `branches_users`
--
ALTER TABLE `branches_users`
  ADD PRIMARY KEY (`branch_id`,`user_id`),
  ADD KEY `branches_users_user_id_foreign` (`user_id`);

--
-- Indexes for table `brands`
--
ALTER TABLE `brands`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `challans`
--
ALTER TABLE `challans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `challans_from_branch_id_foreign` (`from_branch_id`),
  ADD KEY `challans_to_branch_id_foreign` (`to_branch_id`);

--
-- Indexes for table `challan_items`
--
ALTER TABLE `challan_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `challan_items_challan_id_foreign` (`challan_id`),
  ADD KEY `challan_items_product_id_foreign` (`product_id`);

--
-- Indexes for table `client_cart_items`
--
ALTER TABLE `client_cart_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client_cart_items_user_ref_index` (`user_ref`),
  ADD KEY `client_cart_items_product_id_index` (`product_id`),
  ADD KEY `client_cart_items_barcode_index` (`barcode`);

--
-- Indexes for table `colors`
--
ALTER TABLE `colors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customers_group_id_foreign` (`group_id`),
  ADD KEY `customers_membership_id_foreign` (`membership_id`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `knex_migrations`
--
ALTER TABLE `knex_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `knex_migrations_lock`
--
ALTER TABLE `knex_migrations_lock`
  ADD PRIMARY KEY (`index`);

--
-- Indexes for table `memberships`
--
ALTER TABLE `memberships`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `orders_order_id_unique` (`order_id`),
  ADD KEY `orders_customer_id_foreign` (`customer_id`),
  ADD KEY `orders_branch_id_foreign` (`branch_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_items_order_id_foreign` (`order_id`),
  ADD KEY `order_items_product_id_foreign` (`product_id`),
  ADD KEY `order_items_color_id_foreign` (`color_id`),
  ADD KEY `order_items_size_id_foreign` (`size_id`);

--
-- Indexes for table `order_serials`
--
ALTER TABLE `order_serials`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `products_barcode_unique` (`barcode`),
  ADD KEY `products_category_id_foreign` (`category_id`),
  ADD KEY `products_brand_id_foreign` (`brand_id`),
  ADD KEY `products_image_id_foreign` (`image_id`);

--
-- Indexes for table `products_colors`
--
ALTER TABLE `products_colors`
  ADD PRIMARY KEY (`product_id`,`color_id`),
  ADD KEY `products_colors_color_id_foreign` (`color_id`);

--
-- Indexes for table `products_sizes`
--
ALTER TABLE `products_sizes`
  ADD PRIMARY KEY (`product_id`,`size_id`),
  ADD KEY `products_sizes_size_id_foreign` (`size_id`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sales_order_id_unique` (`order_id`),
  ADD KEY `sales_branch_id_foreign` (`branch_id`),
  ADD KEY `sales_customer_id_foreign` (`customer_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD UNIQUE KEY `sessions_session_token_unique` (`session_token`),
  ADD KEY `sessions_user_id_foreign` (`user_id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `settings_key_unique` (`key`);

--
-- Indexes for table `settings_data`
--
ALTER TABLE `settings_data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sizes`
--
ALTER TABLE `sizes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stocks`
--
ALTER TABLE `stocks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stocks_product_id_foreign` (`product_id`),
  ADD KEY `stocks_branch_id_foreign` (`branch_id`),
  ADD KEY `stocks_color_id_foreign` (`color_id`),
  ADD KEY `stocks_size_id_foreign` (`size_id`);

--
-- Indexes for table `stock_histories`
--
ALTER TABLE `stock_histories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `stock_histories_product_id_foreign` (`product_id`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `supplier_payments`
--
ALTER TABLE `supplier_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `supplier_payments_supplier_id_foreign` (`supplier_id`),
  ADD KEY `supplier_payments_payment_method_id_foreign` (`payment_method_id`);

--
-- Indexes for table `tradings`
--
ALTER TABLE `tradings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_customer_id` (`customer_id`),
  ADD KEY `idx_branch_id` (`branch_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `verification_tokens`
--
ALTER TABLE `verification_tokens`
  ADD PRIMARY KEY (`identifier`,`token`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `barcode_serials`
--
ALTER TABLE `barcode_serials`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `branches`
--
ALTER TABLE `branches`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `challans`
--
ALTER TABLE `challans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `challan_items`
--
ALTER TABLE `challan_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `client_cart_items`
--
ALTER TABLE `client_cart_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `colors`
--
ALTER TABLE `colors`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=133;

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `images`
--
ALTER TABLE `images`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `knex_migrations`
--
ALTER TABLE `knex_migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `knex_migrations_lock`
--
ALTER TABLE `knex_migrations_lock`
  MODIFY `index` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `memberships`
--
ALTER TABLE `memberships`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=141;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=175;

--
-- AUTO_INCREMENT for table `order_serials`
--
ALTER TABLE `order_serials`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=302;

--
-- AUTO_INCREMENT for table `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `settings_data`
--
ALTER TABLE `settings_data`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `sizes`
--
ALTER TABLE `sizes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `stocks`
--
ALTER TABLE `stocks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `stock_histories`
--
ALTER TABLE `stock_histories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `supplier_payments`
--
ALTER TABLE `supplier_payments`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tradings`
--
ALTER TABLE `tradings`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accounts`
--
ALTER TABLE `accounts`
  ADD CONSTRAINT `accounts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `branches_users`
--
ALTER TABLE `branches_users`
  ADD CONSTRAINT `branches_users_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `branches_users_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `challans`
--
ALTER TABLE `challans`
  ADD CONSTRAINT `challans_from_branch_id_foreign` FOREIGN KEY (`from_branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `challans_to_branch_id_foreign` FOREIGN KEY (`to_branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `challan_items`
--
ALTER TABLE `challan_items`
  ADD CONSTRAINT `challan_items_challan_id_foreign` FOREIGN KEY (`challan_id`) REFERENCES `challans` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `challan_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `customers_group_id_foreign` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`),
  ADD CONSTRAINT `customers_membership_id_foreign` FOREIGN KEY (`membership_id`) REFERENCES `memberships` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orders_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_color_id_foreign` FOREIGN KEY (`color_id`) REFERENCES `colors` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_size_id_foreign` FOREIGN KEY (`size_id`) REFERENCES `sizes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_brand_id_foreign` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `products_image_id_foreign` FOREIGN KEY (`image_id`) REFERENCES `images` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `products_colors`
--
ALTER TABLE `products_colors`
  ADD CONSTRAINT `products_colors_color_id_foreign` FOREIGN KEY (`color_id`) REFERENCES `colors` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `products_colors_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `products_sizes`
--
ALTER TABLE `products_sizes`
  ADD CONSTRAINT `products_sizes_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `products_sizes_size_id_foreign` FOREIGN KEY (`size_id`) REFERENCES `sizes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `sales_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sales_customer_id_foreign` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `sales_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stocks`
--
ALTER TABLE `stocks`
  ADD CONSTRAINT `stocks_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  ADD CONSTRAINT `stocks_color_id_foreign` FOREIGN KEY (`color_id`) REFERENCES `colors` (`id`),
  ADD CONSTRAINT `stocks_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `stocks_size_id_foreign` FOREIGN KEY (`size_id`) REFERENCES `sizes` (`id`);

--
-- Constraints for table `stock_histories`
--
ALTER TABLE `stock_histories`
  ADD CONSTRAINT `stock_histories_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `supplier_payments`
--
ALTER TABLE `supplier_payments`
  ADD CONSTRAINT `supplier_payments_payment_method_id_foreign` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_methods` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `supplier_payments_supplier_id_foreign` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tradings`
--
ALTER TABLE `tradings`
  ADD CONSTRAINT `fk_tradings_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
