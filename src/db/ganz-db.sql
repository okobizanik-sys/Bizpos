-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 10, 2025 at 07:14 AM
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
(3, 'Mirpur', '213/1, 60 Feet Road, Monipur, Mirpur, Dhaka', '01973590937', 0, '2025-11-05 12:56:09', '2025-11-05 12:56:09');

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
(1, 3),
(2, 2),
(2, 5),
(3, 4);

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
(2, 'Lexor', '2025-11-05 13:04:30', '2025-11-05 13:04:30');

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
(2, 'Men outfit', '2025-11-05 13:04:22', '2025-11-05 13:04:22');

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
(1, 1, 2, 'RECEIVED', 80, '2025-11-05 12:10:48', '2025-11-05 12:11:15', '051125-420');

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

--
-- Dumping data for table `challan_items`
--

INSERT INTO `challan_items` (`id`, `challan_id`, `product_id`, `barcode`, `quantity`, `variant`, `created_at`, `updated_at`) VALUES
(1, 1, 2, '020000', 80, ' - ', '2025-11-05 12:10:48', '2025-11-05 12:10:48');

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
(10, '', '', '2025-11-05 10:04:06', NULL, NULL, '2025-11-05 10:04:06', '2025-11-05 10:04:06', '', NULL, NULL, 'false', NULL),
(11, '', '', '2025-11-05 10:40:01', NULL, NULL, '2025-11-05 10:40:01', '2025-11-05 10:40:01', '', NULL, NULL, 'false', NULL),
(12, '<P>AWEFRAWEFDW</P>', '01917223344', '2025-11-05 12:12:32', NULL, NULL, '2025-11-05 12:12:32', '2025-11-05 12:12:32', 'shameem', NULL, NULL, 'false', NULL),
(13, '<P>AWEFRAWEFDW</P>', '01917223344', '2025-11-05 12:13:18', NULL, NULL, '2025-11-05 12:13:18', '2025-11-05 12:13:18', 'shameem', NULL, NULL, 'false', NULL),
(14, '<P>KAZIPARA, MIRPUR, DHAKA</P>', '01716147486', '2025-11-05 13:02:58', NULL, NULL, '2025-11-05 13:02:58', '2025-11-05 13:02:58', 'shameem', NULL, NULL, 'false', NULL),
(15, '', '', '2025-11-06 10:52:44', NULL, NULL, '2025-11-06 10:52:44', '2025-11-06 10:52:44', '', NULL, NULL, 'false', NULL);

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
(5, '/images/products/product-d7gel-1762433611885.webp', '2025-11-06 12:53:31', '2025-11-06 12:53:31');

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
  `sub_total` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `order_id`, `date`, `total`, `status`, `customer_id`, `created_at`, `updated_at`, `action`, `branch_id`, `comment`, `discount`, `vat`, `delivery_charge`, `due_amount`, `paid_amount`, `payment_method`, `sub_total`) VALUES
(10, '51125003', '2025-11-05 10:04:06', 19900.00, 'COMPLETED', 10, '2025-11-05 10:04:06', '2025-11-05 10:04:06', NULL, 1, NULL, 0, NULL, 0, 0, 20000, NULL, 19900),
(11, '51125005', '2025-11-05 10:40:01', 39800.00, 'COMPLETED', 11, '2025-11-05 10:40:01', '2025-11-05 10:40:01', NULL, 1, NULL, 0, NULL, 0, 0, 40000, NULL, 39800),
(12, '51125007', '2025-11-05 12:12:32', 1060.00, 'COMPLETED', 12, '2025-11-05 12:12:32', '2025-11-05 12:12:32', NULL, 1, NULL, 0, NULL, 60, 0, 0, NULL, 1000),
(13, '51125008', '2025-11-05 12:13:18', 560.00, 'COMPLETED', 13, '2025-11-05 12:13:18', '2025-11-05 12:13:18', NULL, 1, NULL, 0, NULL, 60, 560, 0, NULL, 500),
(14, '51125010', '2025-11-05 13:02:58', 1060.00, 'COMPLETED', 14, '2025-11-05 13:02:58', '2025-11-05 13:02:58', NULL, 1, NULL, 0, NULL, 60, 1060, 0, NULL, 1000),
(15, '61125024', '2025-11-06 10:52:44', 14.00, 'COMPLETED', 15, '2025-11-06 10:52:44', '2025-11-06 10:52:44', NULL, 2, NULL, 0, NULL, 0, 0, 20, NULL, 14);

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
(10, 10, 1, 1, 19900.00, '2025-11-05 10:04:06', '2025-11-05 10:04:06', '010000', 1800, NULL, NULL),
(11, 11, 1, 2, 39800.00, '2025-11-05 10:40:01', '2025-11-05 10:40:01', '010000', 3600, NULL, NULL),
(12, 12, 2, 2, 1000.00, '2025-11-05 12:12:32', '2025-11-05 12:12:32', '020000', 800, NULL, NULL),
(13, 13, 2, 1, 500.00, '2025-11-05 12:13:18', '2025-11-05 12:13:18', '020000', 400, NULL, NULL),
(14, 14, 2, 2, 1000.00, '2025-11-05 13:02:58', '2025-11-05 13:02:58', '020000', 800, NULL, NULL);

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
(31, 31, '2025-11-06 11:50:17', '2025-11-06 11:50:17');

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
(4, 'Cash On Delivery', '2025-11-05 13:01:12', '2025-11-05 13:01:12');

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
  `lc_number` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `sku`, `selling_price`, `description`, `created_at`, `updated_at`, `category_id`, `brand_id`, `image_id`, `lc_number`) VALUES
(1, 'Honor Pad X8a (Wi-Fi) Qualcomm Snapdragon 680 Octa-core Processor 4GB RAM, 128GB ROM 11.0 Inch TFT WUXGA Display Space Gray Tablet', 'Honor Pad X8a (Wi-Fi)', 19900.00, '<h3><strong>General</strong></h3><h3><strong>Brand</strong></h3><h3>Honor</h3><h3><strong>Model</strong></h3><h3>Honor Pad X8a (Wi-Fi)</h3><h3><strong>Performance</strong></h3><h3><strong>Generation</strong></h3><h3>Unmentioned</h3><h3><strong>Processor M', '2025-11-05 09:16:41', '2025-11-05 09:16:41', 1, 1, 5, '101.01.753.08'),
(2, 'Ear Buds', 'Test 123', 500.00, '<p>dfgsfgsdgsd</p>', '2025-11-05 12:05:56', '2025-11-05 12:05:56', 1, 1, 3, '213232'),
(3, 'T-Shirt', 'LX 123', 1000.00, '<p>PK Cotton t-Shirt</p>', '2025-11-05 13:05:11', '2025-11-05 13:05:11', 1, 1, 4, '123456');

-- --------------------------------------------------------

--
-- Table structure for table `products_colors`
--

CREATE TABLE `products_colors` (
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `color_id` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(3, 1);

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
(1, 'LX', '2025-11-05 13:04:56', '2025-11-05 13:04:56');

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
  `quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stocks`
--

INSERT INTO `stocks` (`id`, `product_id`, `branch_id`, `barcode`, `color_id`, `size_id`, `cost`, `created_at`, `updated_at`, `sell_count`, `condition`, `quantity`) VALUES
(1, 1, 1, '010000', NULL, NULL, 1613.00, '2025-11-05 09:17:43', '2025-11-06 12:34:26', 2, 'new', 80),
(2, 1, 1, '010000', NULL, NULL, 1613.00, '2025-11-05 11:00:56', '2025-11-06 12:34:26', 0, 'damaged', 80),
(3, 1, 1, '010000', NULL, NULL, 1613.00, '2025-11-05 11:00:57', '2025-11-06 12:34:26', 0, 'damaged', 80),
(4, 1, 1, '010000', NULL, NULL, 1613.00, '2025-11-05 11:00:58', '2025-11-06 12:34:26', 0, 'damaged', 80),
(5, 1, 1, '010000', NULL, NULL, 1613.00, '2025-11-05 11:00:58', '2025-11-06 12:34:26', 0, 'damaged', 80),
(6, 1, 1, '010000', NULL, NULL, 1613.00, '2025-11-05 11:00:59', '2025-11-06 12:34:26', 0, 'damaged', 80),
(7, 1, 1, '010000', NULL, NULL, 1613.00, '2025-11-05 11:01:00', '2025-11-06 12:34:26', 0, 'damaged', 80),
(8, 1, 1, '010000', NULL, NULL, 1613.00, '2025-11-05 11:01:00', '2025-11-06 12:34:26', 0, 'damaged', 80),
(9, 1, 1, '010000', NULL, NULL, 1613.00, '2025-11-05 11:01:22', '2025-11-06 12:34:26', 0, 'damaged', 80),
(10, 1, 1, '010000', NULL, NULL, 1613.00, '2025-11-05 11:01:23', '2025-11-06 12:34:26', 0, 'damaged', 80),
(11, 1, 1, '010000', NULL, NULL, 1613.00, '2025-11-05 11:01:23', '2025-11-06 12:34:26', 0, 'damaged', 80),
(12, 1, 1, '010000', NULL, NULL, 1613.00, '2025-11-05 11:01:24', '2025-11-06 12:34:26', 0, 'damaged', 80),
(13, 1, 1, '010000', NULL, NULL, 1613.00, '2025-11-05 11:01:24', '2025-11-06 12:34:26', 0, 'damaged', 80),
(14, 1, 1, '010000', NULL, NULL, 1613.00, '2025-11-05 11:01:25', '2025-11-06 12:34:26', 0, 'damaged', 80),
(15, 1, 1, '010000', NULL, NULL, 1613.00, '2025-11-05 11:01:26', '2025-11-06 12:34:26', 0, 'damaged', 80),
(16, 1, 1, '010000', NULL, NULL, 1613.00, '2025-11-05 11:01:26', '2025-11-06 12:34:26', 0, 'damaged', 80),
(17, 1, 1, '010000', NULL, NULL, 1613.00, '2025-11-05 11:01:26', '2025-11-06 12:34:26', 0, 'damaged', 80),
(18, 1, 1, '010000', NULL, NULL, 1613.00, '2025-11-05 11:01:27', '2025-11-06 12:34:26', 0, 'damaged', 80),
(22, 3, 1, '030000', NULL, NULL, 800.00, '2025-11-05 13:06:37', '2025-11-05 13:06:37', 0, 'new', 1000);

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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stock_histories`
--

INSERT INTO `stock_histories` (`id`, `product_id`, `barcode`, `variant`, `quantity`, `cost_per_item`, `created_at`, `updated_at`) VALUES
(1, 1, '010000', ' - ', 50, 1800.00, '2025-11-05 09:17:43', '2025-11-05 09:17:43'),
(2, 2, '020000', ' - ', 100, 400.00, '2025-11-05 12:09:03', '2025-11-05 12:09:03'),
(3, 3, '030000', ' - ', 1000, 800.00, '2025-11-05 13:06:37', '2025-11-05 13:06:37'),
(4, 2, '020000', ' - ', 50, 1000.00, '2025-11-06 10:46:18', '2025-11-06 10:46:18'),
(6, 1, '010000', ' - ', 50, 1500.00, '2025-11-06 12:34:26', '2025-11-06 12:34:26');

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
(2, 'Root', 'root@root.com', '', NULL, 'ADMIN', '2025-11-05 07:45:50', '2025-11-05 07:45:50', '01917223344'),
(3, 'sorower Jahan', 'shameem.rml@gmail.com', '$2a$10$2a1bIDwddhLKCEY/Jp4hDu0vwZqe17kmplYIwOGFf4HPuFnvnkFo2', NULL, 'ADMIN', '2025-11-05 12:03:44', '2025-11-05 12:03:44', '01716147486'),
(4, 'Al Razi Mojumder', 'alrazi@gmail.com', '$2a$10$faYnnvu.WoC8Jx6IiPDLee7slpftC8RBpqpA/d6RnTq2kg0hhd4CO', NULL, 'STAFF', '2025-11-05 12:56:59', '2025-11-05 12:56:59', '01711111111'),
(5, 'Md Abdullah Al Mamun', 'mdabdullah.allinfozone@gmail.com', '$2a$10$jFhQu9GSPMi8i2c0e.3ds.jI/6LaCLzxrmc5cZw1kivLBKl21Z/72', NULL, 'ADMIN', '2025-11-06 10:10:07', '2025-11-06 10:10:07', '01571504613');

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `branches`
--
ALTER TABLE `branches`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `brands`
--
ALTER TABLE `brands`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `challans`
--
ALTER TABLE `challans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `challan_items`
--
ALTER TABLE `challan_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `colors`
--
ALTER TABLE `colors`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `images`
--
ALTER TABLE `images`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `order_serials`
--
ALTER TABLE `order_serials`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sizes`
--
ALTER TABLE `sizes`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `stocks`
--
ALTER TABLE `stocks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `stock_histories`
--
ALTER TABLE `stock_histories`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tradings`
--
ALTER TABLE `tradings`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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
-- Constraints for table `tradings`
--
ALTER TABLE `tradings`
  ADD CONSTRAINT `fk_tradings_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
