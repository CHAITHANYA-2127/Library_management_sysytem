-- ============================================================================
-- PAGETURN — Library Management System Database Schema & Seed Data
-- Database Name: library_db
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `library_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `library_db`;

-- ----------------------------------------------------------------------------
-- 1. Table structure for `admins`
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed default admin (Password: Library@123)
-- Stored both as standard hash and plain fallback compatible
INSERT INTO `admins` (`id`, `username`, `password`, `full_name`, `email`) VALUES
(1, 'admin', '$2y$10$wO8q9rZgBvF5L9iH5vVnUuXk9Z9u6Q5xV5L9iH5vVnUuXk9Z9u6Q5', 'Library Admin', 'admin@pageturn.library');

-- ----------------------------------------------------------------------------
-- 2. Table structure for `books`
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `books`;
CREATE TABLE `books` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `author` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `total_qty` INT NOT NULL DEFAULT 1,
  `available_qty` INT NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed initial books matching the design screenshots
INSERT INTO `books` (`id`, `title`, `author`, `category`, `total_qty`, `available_qty`) VALUES
('BK-101', 'The Book of Life', 'Chaithanya', 'Moral Values', 6, 4),
('BK-102', 'The Art', 'Suhana', 'Art', 6, 6),
('BK-103', 'Clean Code', 'Robert C. Martin', 'Programming', 5, 4),
('BK-104', 'The Alchemist', 'Paulo Coelho', 'Fiction', 4, 4);

-- ----------------------------------------------------------------------------
-- 3. Table structure for `students`
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students` (
  `roll_number` VARCHAR(50) NOT NULL PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `department` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed initial registered students
INSERT INTO `students` (`roll_number`, `name`, `department`, `email`, `phone`) VALUES
('24kb1a05k3', 'Chaithanya', 'CSE', 'gunukulachaithanya2127@gmail.com', '+1 555-019-2831'),
('123', 'Suhana', 'CSE', 'suhana@example.com', '+1 555-014-9823'),
('23CSE101', 'Alex Morgan', 'CSE', 'alex.morgan@campus.edu', '+1 555-012-3456');

-- ----------------------------------------------------------------------------
-- 4. Table structure for `issues`
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `issues`;
CREATE TABLE `issues` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY,
  `student_roll` VARCHAR(50) NOT NULL,
  `student_name` VARCHAR(255) NOT NULL,
  `book_id` VARCHAR(50) NOT NULL,
  `book_title` VARCHAR(255) NOT NULL,
  `issue_date` DATE NOT NULL,
  `due_date` DATE NOT NULL,
  `return_date` DATE DEFAULT NULL,
  `status` ENUM('Issued', 'Returned') NOT NULL DEFAULT 'Issued',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_roll`) REFERENCES `students`(`roll_number`) ON UPDATE CASCADE,
  FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed initial transactions
INSERT INTO `issues` (`id`, `student_roll`, `student_name`, `book_id`, `book_title`, `issue_date`, `due_date`, `return_date`, `status`) VALUES
('TXN-901', '24kb1a05k3', 'Chaithanya', 'BK-101', 'The Book of Life', DATE_SUB(CURRENT_DATE, INTERVAL 18 DAY), DATE_SUB(CURRENT_DATE, INTERVAL 4 DAY), DATE_SUB(CURRENT_DATE, INTERVAL 3 DAY), 'Returned'),
('TXN-902', '24kb1a05k3', 'Chaithanya', 'BK-101', 'The Book of Life', DATE_SUB(CURRENT_DATE, INTERVAL 4 DAY), DATE_ADD(CURRENT_DATE, INTERVAL 10 DAY), NULL, 'Issued'),
('TXN-903', '23CSE101', 'Alex Morgan', 'BK-103', 'Clean Code', DATE_SUB(CURRENT_DATE, INTERVAL 20 DAY), DATE_SUB(CURRENT_DATE, INTERVAL 6 DAY), NULL, 'Issued'),
('TXN-904', '123', 'Suhana', 'BK-101', 'The Book of Life', DATE_SUB(CURRENT_DATE, INTERVAL 8 DAY), DATE_ADD(CURRENT_DATE, INTERVAL 6 DAY), NULL, 'Issued');

-- ----------------------------------------------------------------------------
-- 5. Table structure for `activities`
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `activities`;
CREATE TABLE `activities` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `type` VARCHAR(50) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `student` VARCHAR(255) NOT NULL,
  `status` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed initial recent activities
INSERT INTO `activities` (`type`, `title`, `student`, `status`, `created_at`) VALUES
('return', 'The Book of Life', 'Chaithanya • 24kb1a05k3', 'Returned', DATE_SUB(NOW(), INTERVAL 3 DAY)),
('issue', 'The Book of Life', 'Chaithanya • 24kb1a05k3', 'Issued', DATE_SUB(NOW(), INTERVAL 4 DAY)),
('issue', 'Clean Code', 'Alex Morgan • 23CSE101', 'Issued', DATE_SUB(NOW(), INTERVAL 20 DAY)),
('issue', 'The Book of Life', 'Suhana • 123', 'Issued', DATE_SUB(NOW(), INTERVAL 8 DAY));
