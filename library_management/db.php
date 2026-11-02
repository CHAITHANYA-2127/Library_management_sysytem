<?php
/**
 * ============================================================================
 * PAGETURN — Library Management System
 * Central Database Connection & Helper Functions
 * ============================================================================
 */

// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'library_db');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

/**
 * Get PDO Database Connection
 * @return PDO
 */
function getDBConnection() {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            die("<h3>Database Connection Error:</h3><p>" . htmlspecialchars($e->getMessage()) . "</p><p>Please ensure your MySQL server is running in XAMPP/WAMP and that you have imported <code>database/library.sql</code> into <code>library_db</code>.</p>");
        }
    }
    return $pdo;
}

/**
 * Check if admin is currently authenticated
 * @return bool
 */
function isLoggedIn() {
    return isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
}

/**
 * Enforce authentication for protected admin pages
 * @param string $relativePathToRoot Relative path back to library_management root (e.g. '' or '../')
 */
function requireLogin($relativePathToRoot = '') {
    if (!isLoggedIn()) {
        header("Location: " . $relativePathToRoot . "login.php");
        exit;
    }
}

/**
 * Set a flash notification message
 * @param string $type success | error | warning | info
 * @param string $message
 */
function setFlash($type, $message) {
    $_SESSION['flash_message'] = [
        'type'    => $type,
        'message' => $message
    ];
}

/**
 * Retrieve and clear the current flash message
 * @return array|null
 */
function getFlash() {
    if (isset($_SESSION['flash_message'])) {
        $msg = $_SESSION['flash_message'];
        unset($_SESSION['flash_message']);
        return $msg;
    }
    return null;
}

/**
 * Escape string for safe HTML output
 * @param string|null $string
 * @return string
 */
function h($string) {
    return htmlspecialchars($string ?? '', ENT_QUOTES, 'UTF-8');
}

/**
 * Check if a due date is overdue compared to today
 * @param string $dueDateStr YYYY-MM-DD
 * @return bool
 */
function isDateOverdue($dueDateStr) {
    if (empty($dueDateStr)) return false;
    return $dueDateStr < date('Y-m-d');
}

/**
 * Insert record into activity log
 */
function logActivity($pdo, $type, $title, $student, $status) {
    try {
        $stmt = $pdo->prepare("INSERT INTO activities (type, title, student, status, created_at) VALUES (?, ?, ?, ?, NOW())");
        $stmt->execute([$type, $title, $student, $status]);
    } catch (Exception $e) {
        // Silently skip activity logging on minor errors
    }
}
