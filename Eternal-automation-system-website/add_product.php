<?php
session_start();
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header('Location: admin_giris.php');
    exit;
}

// Veritabanı bağlantısı
include 'baglanti.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $product_name = $_POST['product_name'];
    $product_description = $_POST['product_description'];
    
    // Birinci görsel
    $product_image1 = $_FILES['product_image1']['name'];
    move_uploaded_file($_FILES['product_image1']['tmp_name'], 'uploads/' . $product_image1);
    
    // İkinci görsel
    $product_image2 = $_FILES['product_image2']['name'];
    move_uploaded_file($_FILES['product_image2']['tmp_name'], 'uploads/' . $product_image2);
    
    // Veritabanına kaydetme işlemi (foto ve foto2 olarak)
    $stmt = $pdo->prepare("INSERT INTO urunler (isim, bilgi, foto, foto2) VALUES (?, ?, ?, ?)");
    $stmt->execute([$product_name, $product_description, $product_image1, $product_image2]);
    
    echo "Ürün başarıyla eklendi!";
}
?>


<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ürün Ekle</title>
    <link rel="stylesheet" href="css/admin.css" />
</head>
<body>
    <div class="add-product-form">
        <a href="admin_giris.php?logout=true" class="logout-btn">Çıkış Yap</a>
        <a href="index.html" class="home-btn">Anasayfaya Dön</a>
        <a href="admin_panel.php" class="back-btn">Admin Paneline Dön</a>
        <h2>Ürün Ekle</h2>
            <form action="add_product.php" method="POST" enctype="multipart/form-data">
                <label for="product_name">Ürün Adı:</label>
                <input type="text" id="product_name" name="product_name" required>

                <label for="product_description">Ürün Açıklaması:</label>
                <textarea id="product_description" name="product_description" required></textarea>

                <label for="product_image1">Birinci Ürün Görseli:</label>
                <input type="file" id="product_image1" name="product_image1" required>

                <label for="product_image2">İkinci Ürün Görseli (Hover için):</label>
                <input type="file" id="product_image2" name="product_image2" required>

                <button type="submit">Ürün Ekle</button>
            </form>

    </div>
</body>
</html>
