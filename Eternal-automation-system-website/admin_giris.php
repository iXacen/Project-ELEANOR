<?php
session_start();
$correct_username = 'admin';
$correct_password_hash = '$2y$10$XdQrqrqINBTEwr8wwjyIAeuX6D9KgOeLKgCnxy4EDRqQypMaGoJE6'; 

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    if ($username === $correct_username && password_verify($password, $correct_password_hash)) {
        $_SESSION['logged_in'] = true;
        header('Location: admin_panel.php');
        exit;
    } else {
        $error_message = 'Hatalı kullanıcı adı veya şifre!';
    }
}
?>


<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Giriş</title>
    <link rel="stylesheet" href="css/admin.css" />
</head>
<body>
    <div class="admin-giris-form">
        <a href="index.html" class="home-btn">Anasayfaya Dön</a>
        <h2>Admin Girişi</h2>
        <form action="admin_giris.php" method="POST">
            <?php if (isset($error_message)) { echo "<p class='error'>$error_message</p>"; } ?>
            <label for="username">Kullanıcı Adı:</label>
            <input type="text" id="username" name="username" required>

            <label for="password">Şifre:</label>
            <input type="password" id="password" name="password" required>

            <button type="submit">Giriş Yap</button>
        </form>
    </div>
</body>
</html>

