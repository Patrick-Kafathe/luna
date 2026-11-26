<?php
require __DIR__ . '/config.php';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
$https = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
session_set_cookie_params(['httponly' => true, 'samesite' => 'Strict', 'secure' => $https]);
session_name('luna_admin');
session_start();

$DATA = __DIR__ . '/data';
// Files begin with an exit line so they cannot be read from the web, whatever the server.
const GUARD = "<?php exit; ?>\n";

function out($d, $code = 200) { http_response_code($code); echo json_encode($d, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE); exit; }
function fail($m, $code = 400) { out(['error' => $m], $code); }
function read_store($name, $default) {
  global $DATA; $f = "$DATA/$name.php";
  if (!is_file($f)) return $default;
  $j = json_decode(substr(file_get_contents($f), strlen(GUARD)), true);
  return $j === null ? $default : $j;
}
function write_store($name, $value) {
  global $DATA;
  if (!is_dir($DATA) && !mkdir($DATA, 0755, true)) fail('Cannot create the data folder', 500);
  if (file_put_contents("$DATA/$name.php", GUARD . json_encode($value, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE), LOCK_EX) === false) fail('Cannot save. Make the data folder writable.', 500);
}
function body($max) {
  $raw = file_get_contents('php://input', false, null, 0, $max + 1);
  if (strlen($raw) > $max) fail('Too large', 413);
  $j = json_decode($raw, true);
  if (!is_array($j)) fail('Invalid request');
  return $j;
}
// A password change bumps the version, which signs out every other session.
function logged_in() { return !empty($_SESSION['admin']) && ($_SESSION['ver'] ?? 0) === (read_store('auth', [])['ver'] ?? 0); }
function password_ok($p) {
  global $ADMIN_PASSWORD; $a = read_store('auth', []);
  return isset($a['hash']) ? password_verify($p, $a['hash']) : (strlen($ADMIN_PASSWORD) >= 10 && hash_equals($ADMIN_PASSWORD, $p));
}
function throttle() {
  $ip = hash('sha256', $_SERVER['REMOTE_ADDR'] ?? '');
  $tries = array_values(array_filter(read_store('attempts', []), fn($t) => $t['at'] > time() - 900));
  if (count(array_filter($tries, fn($t) => $t['ip'] === $ip)) >= 8) fail('Too many attempts. Wait 15 minutes.', 429);
  return [$ip, $tries];
}
function admin() {
  if (!logged_in()) fail('Please log in again', 401);
  if (!hash_equals($_SESSION['csrf'], $_SERVER['HTTP_X_CSRF'] ?? '')) fail('Please reload and log in again', 403);
}
function clip($v, $n) { return mb_substr(trim(is_scalar($v) ? (string)$v : ''), 0, $n); }

function http_json($url) {
  if (function_exists('curl_init')) {
    $c = curl_init($url);
    curl_setopt_array($c, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 8, CURLOPT_CONNECTTIMEOUT => 5]);
    $raw = curl_exec($c); curl_close($c);
  } else {
    $raw = @file_get_contents($url, false, stream_context_create(['http' => ['timeout' => 8, 'ignore_errors' => true]]));
  }
  return is_string($raw) ? json_decode($raw, true) : null;
}
// Fetch the latest posts. Results are cached so visitors do not hit Meta on every page view.
function social_sync($force = false) {
  $cfg = read_store('social', []);
  $feed = read_store('feed', ['synced' => 0, 'posts' => [], 'error' => '']);
  if (!$cfg) return ['synced' => 0, 'posts' => [], 'error' => ''];
  if (!$force && time() - $feed['synced'] < 1800) return $feed;
  $feed['synced'] = time(); write_store('feed', $feed);
  $posts = []; $errors = [];
  $old = fn($source) => array_values(array_filter($feed['posts'], fn($p) => $p['source'] === $source));
  if (!empty($cfg['instagram'])) {
    // Instagram tokens last 60 days; renew weekly.
    if (time() - ($cfg['ig_renewed'] ?? 0) > 604800) {
      $r = http_json('https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=' . urlencode($cfg['instagram']));
      if (!empty($r['access_token'])) { $cfg['instagram'] = $r['access_token']; $cfg['ig_renewed'] = time(); write_store('social', $cfg); }
    }
    $r = http_json('https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=12&access_token=' . urlencode($cfg['instagram']));
    if (isset($r['data'])) foreach ($r['data'] as $m) {
      $img = ($m['media_type'] ?? '') === 'VIDEO' ? ($m['thumbnail_url'] ?? '') : ($m['media_url'] ?? '');
      $posts[] = ['source' => 'Instagram', 'text' => clip($m['caption'] ?? '', 600), 'image' => $img, 'link' => $m['permalink'] ?? '', 'date' => $m['timestamp'] ?? ''];
    } else { $errors[] = 'Instagram: ' . clip($r['error']['message'] ?? 'no answer', 200); $posts = array_merge($posts, $old('Instagram')); }
  }
  if (!empty($cfg['facebook']) && !empty($cfg['pageId'])) {
    $r = http_json('https://graph.facebook.com/v26.0/' . rawurlencode($cfg['pageId']) . '/posts?fields=message,full_picture,permalink_url,created_time&limit=12&access_token=' . urlencode($cfg['facebook']));
    if (isset($r['data'])) foreach ($r['data'] as $m) {
      if (empty($m['message']) && empty($m['full_picture'])) continue;
      $posts[] = ['source' => 'Facebook', 'text' => clip($m['message'] ?? '', 600), 'image' => $m['full_picture'] ?? '', 'link' => $m['permalink_url'] ?? '', 'date' => $m['created_time'] ?? ''];
    } else { $errors[] = 'Facebook: ' . clip($r['error']['message'] ?? 'no answer', 200); $posts = array_merge($posts, $old('Facebook')); }
  }
  usort($posts, fn($a, $b) => strtotime($b['date']) <=> strtotime($a['date']));
  $feed = ['synced' => time(), 'posts' => array_slice($posts, 0, 12), 'error' => implode(' ', $errors)];
  write_store('feed', $feed);
  return $feed;
}
function social_status($feed) {
  $cfg = read_store('social', []);
  return ['instagram' => !empty($cfg['instagram']), 'facebook' => !empty($cfg['facebook']) && !empty($cfg['pageId']), 'pageId' => $cfg['pageId'] ?? '', 'synced' => $feed['synced'], 'count' => count($feed['posts']), 'error' => $feed['error']];
}

$action = $_GET['action'] ?? '';
if ($action !== 'get' && ($_SERVER['HTTP_X_LUNA'] ?? '') !== '1') fail('Not allowed', 403);
if (in_array($action, ['login','logout','save','upload','order','order_status','social_save','password']) && $_SERVER['REQUEST_METHOD'] !== 'POST') fail('Use POST', 405);

switch ($action) {
  case 'social':
    session_write_close();
    out(['posts' => social_sync()['posts']]);

  case 'social_status':
    admin(); out(social_status(read_store('feed', ['synced' => 0, 'posts' => [], 'error' => ''])));

  case 'social_save':
    admin();
    $b = body(5000);
    if (!empty($b['disconnect'])) { write_store('social', []); write_store('feed', ['synced' => 0, 'posts' => [], 'error' => '']); out(social_status(read_store('feed', []))); }
    $cfg = read_store('social', []);
    if (clip($b['instagram'] ?? '', 600) !== '') { $cfg['instagram'] = clip($b['instagram'], 600); $cfg['ig_renewed'] = time(); }
    if (clip($b['facebook'] ?? '', 600) !== '') $cfg['facebook'] = clip($b['facebook'], 600);
    if (isset($b['pageId'])) $cfg['pageId'] = preg_replace('/[^A-Za-z0-9._-]/', '', clip($b['pageId'], 60));
    write_store('social', $cfg);
    out(social_status(social_sync(true)));

  case 'get':
    $authed = logged_in();
    out(['luna' => true, 'authed' => $authed, 'csrf' => $authed ? $_SESSION['csrf'] : '', 'content' => (object)read_store('content', [])]);

  case 'login':
    [$ip, $tries] = throttle();
    $auth = read_store('auth', []);
    if (!isset($auth['hash']) && strlen($ADMIN_PASSWORD) < 10) fail('Set a password of at least 10 characters in config.php first.', 403);
    if (!password_ok((string)(body(2000)['password'] ?? ''))) { $tries[] = ['ip' => $ip, 'at' => time()]; write_store('attempts', $tries); fail('Wrong password', 401); }
    session_regenerate_id(true);
    $_SESSION['admin'] = true;
    $_SESSION['ver'] = $auth['ver'] ?? 0;
    $_SESSION['csrf'] = bin2hex(random_bytes(24));
    out(['csrf' => $_SESSION['csrf']]);

  case 'password':
    admin();
    [$ip, $tries] = throttle();
    $b = body(3000); $new = (string)($b['next'] ?? '');
    if (!password_ok((string)($b['current'] ?? ''))) { $tries[] = ['ip' => $ip, 'at' => time()]; write_store('attempts', $tries); fail('The current password is wrong', 403); }
    if (strlen($new) < 10 || strlen($new) > 72) fail('Use between 10 and 72 characters');
    $ver = time();
    write_store('auth', ['hash' => password_hash($new, PASSWORD_DEFAULT), 'ver' => $ver]);
    session_regenerate_id(true);
    $_SESSION['ver'] = $ver;
    out(['ok' => true]);

  case 'logout':
    $_SESSION = []; session_destroy(); out(['ok' => true]);

  case 'save':
    admin();
    $c = body(4000000)['content'] ?? null;
    if (!is_array($c) || !isset($c['brand'], $c['products'])) fail('Invalid content');
    write_store('content', $c); out(['ok' => true]);

  case 'upload':
    admin();
    $f = $_FILES['photo'] ?? null;
    if (!$f || $f['error'] !== UPLOAD_ERR_OK || $f['size'] > 6000000) fail('Upload failed. Use a photo under 6 MB.');
    $info = @getimagesize($f['tmp_name']);
    $ext = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_WEBP => 'webp'][$info[2] ?? 0] ?? null;
    if (!$ext) fail('Only JPG, PNG or WebP photos are allowed');
    $dir = __DIR__ . '/uploads';
    if (!is_dir($dir)) mkdir($dir, 0755, true);
    $name = bin2hex(random_bytes(10)) . '.' . $ext;
    if (!move_uploaded_file($f['tmp_name'], "$dir/$name")) fail('Make the uploads folder writable', 500);
    out(['path' => "uploads/$name"]);

  case 'order':
    if ((read_store('content', [])['store']['ordering'] ?? true) === false) fail('Online orders are paused', 403);
    $o = body(20000);
    $orders = read_store('orders', []);
    $ip = hash('sha256', $_SERVER['REMOTE_ADDR'] ?? '');
    if (count(array_filter($orders, fn($x) => ($x['ip'] ?? '') === $ip && strtotime($x['date']) > time() - 3600)) >= 10) fail('Too many orders. Please contact us.', 429);
    $items = [];
    foreach (array_slice((array)($o['items'] ?? []), 0, 40) as $i) {
      $items[] = ['name' => clip($i['name'] ?? '', 100), 'qty' => max(1, min(99, (int)($i['qty'] ?? 1))), 'price' => clip($i['price'] ?? '', 30)];
    }
    if (!$items || clip($o['name'] ?? '', 80) === '' || clip($o['phone'] ?? '', 30) === '') fail('Missing details');
    $order = ['id' => 'LC' . strtoupper(bin2hex(random_bytes(4))), 'date' => date('c'), 'status' => 'New', 'ip' => $ip, 'items' => $items];
    foreach (['name' => 80, 'phone' => 30, 'delivery' => 100, 'payment' => 80, 'note' => 500, 'total' => 80, 'when' => 20, 'gift' => 300] as $k => $n) $order[$k] = clip($o[$k] ?? '', $n);
    array_unshift($orders, $order);
    write_store('orders', array_slice($orders, 0, 2000));
    out(['id' => $order['id']]);

  case 'orders':
    admin();
    out(['orders' => array_map(function ($o) { unset($o['ip']); return $o; }, read_store('orders', []))]);

  case 'order_status':
    admin();
    $b = body(2000); $id = (string)($b['id'] ?? ''); $s = (string)($b['status'] ?? '');
    if (!in_array($s, ['New','Confirmed','Paid','Delivered','Cancelled','delete'])) fail('Unknown status');
    $orders = read_store('orders', []);
    if ($s === 'delete') $orders = array_values(array_filter($orders, fn($o) => $o['id'] !== $id));
    else foreach ($orders as &$o) if ($o['id'] === $id) $o['status'] = $s;
    write_store('orders', $orders); out(['ok' => true]);

  default:
    fail('Unknown action', 404);
}
