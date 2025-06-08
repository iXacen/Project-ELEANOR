<?php
$servername = "localhost"; // Sunucu adı
$username = "root"; // MySQL kullanıcı adı
$password = ""; // MySQL şifre
$dbname = "urunler2"; // Veritabanı adı

// Veritabanı bağlantısı
$conn = new mysqli($servername, $username, $password, $dbname);

// Bağlantı kontrolü
if ($conn->connect_error) {
    die("Bağlantı hatası: " . $conn->connect_error);
}
?>

<?php
$host = 'localhost';
$db = 'urunler2';  // Burada veritabanı adını girin
$user = 'root';
$pass = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Veritabanı bağlantısı başarısız: " . $e->getMessage());
}

?>