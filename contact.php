<?php
/**
 * contact.php — Contact Form Backend
 * ============================================================
 * Receives a POST request from the contact form, validates and
 * sanitises all inputs, then sends an email via PHP's mail().
 *
 * Security measures:
 *  - CORS origin check
 *  - HTTP method enforcement
 *  - Honeypot spam trap
 *  - Input sanitisation & validation
 *  - Rate limiting (session-based, 3 per hour)
 *  - JSON-only responses (never echoes raw HTML)
 * ============================================================
 */

/* ──────────────────────────────────────────────────────────────
   0.  CONFIGURATION  — Edit these values
────────────────────────────────────────────────────────────── */
define('RECIPIENT_EMAIL', 'amadinethsarani611@gmail.com');          // Where messages are sent
define('RECIPIENT_NAME',  'Amadi Navodya');               // Your display name
define('SITE_NAME',       'Amadi Navodya Portfolio');     // Used in email subject
define('ALLOWED_ORIGIN',  '');                          // e.g. 'https://yoursite.com' or '' to skip
define('RATE_LIMIT',      3);                           // Max submissions per RATE_WINDOW
define('RATE_WINDOW',     3600);                        // Window in seconds (1 hour)


/* ──────────────────────────────────────────────────────────────
   1.  HEADERS — JSON + CORS
────────────────────────────────────────────────────────────── */
header('Content-Type: application/json; charset=utf-8');

// Allow same-origin requests (or a specific origin if configured)
if (!empty(ALLOWED_ORIGIN)) {
    header('Access-Control-Allow-Origin: ' . ALLOWED_ORIGIN);
} else {
    // Development: allow all origins (tighten for production)
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle pre-flight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}


/* ──────────────────────────────────────────────────────────────
   2.  HELPER FUNCTIONS
────────────────────────────────────────────────────────────── */

/**
 * Output a JSON response and terminate.
 *
 * @param bool   $success
 * @param string $message  Human-readable message shown in the form alert
 * @param int    $code     HTTP status code
 */
function respond(bool $success, string $message, int $code = 200): void {
    http_response_code($code);
    echo json_encode([
        'success' => $success,
        'message' => $message,
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/**
 * Sanitise a plain-text input: strip tags, trim, normalise whitespace.
 */
function sanitizeText(string $value): string {
    $value = strip_tags($value);
    $value = htmlspecialchars($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $value = preg_replace('/\s+/', ' ', $value);
    return trim($value);
}

/**
 * Check whether an email header contains injection characters.
 */
function hasHeaderInjection(string $value): bool {
    return (bool) preg_match('/[\r\n\0%]/', $value);
}


/* ──────────────────────────────────────────────────────────────
   3.  METHOD CHECK
────────────────────────────────────────────────────────────── */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Method not allowed.', 405);
}


/* ──────────────────────────────────────────────────────────────
   4.  SESSION-BASED RATE LIMITING
────────────────────────────────────────────────────────────── */
session_start();

$now = time();

// Initialise or reset window
if (
    !isset($_SESSION['cf_count'], $_SESSION['cf_window_start']) ||
    ($now - $_SESSION['cf_window_start']) > RATE_WINDOW
) {
    $_SESSION['cf_count']        = 0;
    $_SESSION['cf_window_start'] = $now;
}

$_SESSION['cf_count']++;

if ($_SESSION['cf_count'] > RATE_LIMIT) {
    $waitMins = ceil((RATE_WINDOW - ($now - $_SESSION['cf_window_start'])) / 60);
    respond(
        false,
        "⏳ Too many messages. Please wait {$waitMins} minute(s) before trying again.",
        429
    );
}


/* ──────────────────────────────────────────────────────────────
   5.  HONEYPOT SPAM CHECK  (hidden field; bots fill it in)
────────────────────────────────────────────────────────────── */
if (!empty($_POST['honeypot'])) {
    // Silently succeed — don't tell bots they've been caught
    respond(true, '✅ Message sent successfully!');
}


/* ──────────────────────────────────────────────────────────────
   6.  COLLECT & SANITISE INPUTS
────────────────────────────────────────────────────────────── */
$rawName    = $_POST['name']    ?? '';
$rawEmail   = $_POST['email']   ?? '';
$rawSubject = $_POST['subject'] ?? '';
$rawService = $_POST['service'] ?? '';
$rawMessage = $_POST['message'] ?? '';

$name    = sanitizeText($rawName);
$email   = filter_var(trim($rawEmail), FILTER_SANITIZE_EMAIL);
$subject = sanitizeText($rawSubject);
$service = sanitizeText($rawService);
$message = sanitizeText($rawMessage);


/* ──────────────────────────────────────────────────────────────
   7.  SERVER-SIDE VALIDATION
────────────────────────────────────────────────────────────── */
$errors = [];

// Name: 2–80 chars
if (strlen($name) < 2 || strlen($name) > 80) {
    $errors[] = 'Name must be between 2 and 80 characters.';
}

// Email: valid format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please enter a valid email address.';
}

// Email: max length sanity check
if (strlen($email) > 254) {
    $errors[] = 'Email address is too long.';
}

// Subject: 4–120 chars
if (strlen($subject) < 4 || strlen($subject) > 120) {
    $errors[] = 'Subject must be between 4 and 120 characters.';
}

// Message: 15–3000 chars
if (strlen($message) < 15 || strlen($message) > 3000) {
    $errors[] = 'Message must be between 15 and 3,000 characters.';
}

// Header injection guards
if (hasHeaderInjection($name) || hasHeaderInjection($email) || hasHeaderInjection($subject)) {
    $errors[] = 'Invalid characters detected in your input.';
}

if (!empty($errors)) {
    respond(false, implode(' ', $errors), 422);
}


/* ──────────────────────────────────────────────────────────────
   8.  BUILD EMAIL
────────────────────────────────────────────────────────────── */

// Map service codes to labels
$serviceLabels = [
    'frontend'   => 'Frontend Development',
    'fullstack'  => 'Full-Stack Web Development',
    'wordpress'  => 'WordPress Development',
    'androidapp' => 'Android App Development',
    'qa'         => 'Software QA & Testing',
    'ui/ux'      => 'UI/UX Design',
    'other'      => 'Other',
    ''           => 'Not specified',
];
$serviceLabel = $serviceLabels[$service] ?? sanitizeText($service);

// ----- Plain-text body -----
$textBody = <<<TXT
New message from your portfolio contact form
=============================================

Name    : {$name}
Email   : {$email}
Subject : {$subject}
Service : {$serviceLabel}

Message:
{$message}

---
Sent via {$_SERVER['HTTP_HOST']} | {$_SERVER['REMOTE_ADDR']}
TXT;

// ----- HTML body -----
$htmlBody = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    body    { font-family: 'Segoe UI', Arial, sans-serif; background:#0e0c1e; color:#e0deff; margin:0; padding:0; }
    .wrap   { max-width:600px; margin:32px auto; background:#1a1730; border:1px solid #2e2b50; border-radius:12px; overflow:hidden; }
    .header { background:linear-gradient(135deg,#7c3aed,#06b6d4); padding:32px 24px; }
    .header h1 { color:#fff; margin:0; font-size:1.4rem; font-weight:700; letter-spacing:.05em; }
    .body   { padding:28px 24px; }
    .row    { display:flex; gap:8px; margin-bottom:14px; border-bottom:1px solid #2e2b50; padding-bottom:14px; }
    .row:last-of-type { border-bottom:none; }
    .label  { font-size:.75rem; text-transform:uppercase; letter-spacing:.1em; color:#8b7fd4; width:90px; flex-shrink:0; padding-top:2px; font-family:monospace; }
    .value  { font-size:.9rem; color:#c8c2f0; flex:1; word-break:break-word; }
    .message-box { background:#13102a; border:1px solid #2e2b50; border-radius:8px; padding:16px; margin-top:8px; font-size:.9rem; line-height:1.7; color:#c8c2f0; white-space:pre-wrap; }
    .footer { background:#130e22; padding:16px 24px; font-size:.75rem; color:#5a5480; text-align:center; border-top:1px solid #2e2b50; }
  </style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <h1>📬 New Portfolio Message</h1>
  </div>
  <div class="body">
    <div class="row">
      <span class="label">Name</span>
      <span class="value">{$name}</span>
    </div>
    <div class="row">
      <span class="label">Email</span>
      <span class="value"><a href="mailto:{$email}" style="color:#22d3ee;">{$email}</a></span>
    </div>
    <div class="row">
      <span class="label">Subject</span>
      <span class="value">{$subject}</span>
    </div>
    <div class="row">
      <span class="label">Service</span>
      <span class="value">{$serviceLabel}</span>
    </div>
    <div class="row" style="flex-direction:column;">
      <span class="label">Message</span>
      <div class="message-box">{$message}</div>
    </div>
  </div>
  <div class="footer">
    Sent via {$_SERVER['HTTP_HOST']} &mdash; {$_SERVER['REMOTE_ADDR']}
  </div>
</div>
</body>
</html>
HTML;


/* ──────────────────────────────────────────────────────────────
   9.  SEND EMAIL
────────────────────────────────────────────────────────────── */

// Generate a unique boundary for multipart MIME
$boundary = '----=_Part_' . md5(uniqid('', true));

$to      = RECIPIENT_NAME . ' <' . RECIPIENT_EMAIL . '>';
$mailSubject = '[' . SITE_NAME . '] ' . $subject;

// RFC-compliant headers
$headers  = "From: {$name} <" . RECIPIENT_EMAIL . ">\r\n";   // Send from site address to avoid spam
$headers .= "Reply-To: {$name} <{$email}>\r\n";              // Reply goes to sender
$headers .= "Return-Path: " . RECIPIENT_EMAIL . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: multipart/alternative; boundary=\"{$boundary}\"\r\n";
$headers .= "X-Mailer: PHP/" . PHP_VERSION . "\r\n";
$headers .= "X-Priority: 3\r\n";

// Build multipart body (plain text + HTML)
$body  = "--{$boundary}\r\n";
$body .= "Content-Type: text/plain; charset=UTF-8\r\n";
$body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
$body .= $textBody . "\r\n\r\n";

$body .= "--{$boundary}\r\n";
$body .= "Content-Type: text/html; charset=UTF-8\r\n";
$body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
$body .= $htmlBody . "\r\n\r\n";

$body .= "--{$boundary}--";

// Attempt to send
$sent = mail($to, $mailSubject, $body, $headers);

if ($sent) {
    respond(true, '✅ Message sent! I\'ll get back to you within 24 hours.');
} else {
    // Log the failure server-side
    error_log('[contact.php] mail() failed — To: ' . $to . ' | IP: ' . $_SERVER['REMOTE_ADDR']);
    respond(
        false,
        '⚠️ There was a problem sending your message. Please email me directly at ' . RECIPIENT_EMAIL,
        500
    );
}
