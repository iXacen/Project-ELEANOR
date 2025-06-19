<?php
session_start();

// Eğer kullanıcı giriş yapmamışsa, giriş sayfasına yönlendir
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header('Location: admin_giris.php');
    exit;
}
?>

<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Paneli</title>
    <link rel="stylesheet" href="css/admin.css" />
</head>
<body>
    <div class="admin-panel">
        <a href="admin_giris.php?logout=true" class="logout-btn">Çıkış Yap</a>
        <a href="index.html" class="home-btn">Anasayfaya Dön</a>
        <h1>Hoşgeldiniz, Admin</h1>

        <h3>Yönetim Paneline Hoşgeldiniz</h3>
        
        <!-- Burada ürün ekleme, düzenleme veya veri görüntüleme işlemleri olabilir -->
            <div class="admin-options">
                <a href="add_product.php" class="btn">Ürün Ekle</a>
                <a href="view_products.php" class="btn">Ürünleri Görüntüle</a>
                <a href="add_document.php" class="btn">Belge Ekle</a>
                <a href="view_documents.php" class="btn">Belgeleri Görüntüle</a>
            </div>
    </div>

    <?php
    // Çıkış işlemi
    if (isset($_GET['logout']) && $_GET['logout'] == 'true') {
        session_destroy();  // Oturumu sonlandır
        header('Location: admin_giris.php'); // Giriş sayfasına yönlendir
        exit;
    }
    ?>
</body>
</html>
