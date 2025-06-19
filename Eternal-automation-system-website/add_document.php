<?php
session_start();
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header('Location: admin_giris.php');
    exit;
}

include 'baglanti.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $document_name = $_POST['document_name'];
    
    // PDF dosyası yükleme
    $document_pdf = $_FILES['document_pdf']['name'];
    move_uploaded_file($_FILES['document_pdf']['tmp_name'], 'uploads/documents/' . $document_pdf);
    
    // Fotoğraf yükleme
    $document_photo = $_FILES['document_photo']['name'];
    move_uploaded_file($_FILES['document_photo']['tmp_name'], 'uploads/documents/' . $document_photo);
    
    // Veritabanına kaydetme
    $stmt = $pdo->prepare("INSERT INTO belgeler (belge_adi, belge_pdf, belge_foto) VALUES (?, ?, ?)");
    $stmt->execute([$document_name, $document_pdf, $document_photo]);
    
    echo "Belge başarıyla eklendi!";
}
?>

<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Belge Ekle</title>
    <link rel="stylesheet" href="css/admin.css" />
</head>
<body>
    <div class="add-product-form">
        <a href="admin_giris.php?logout=true" class="logout-btn">Çıkış Yap</a>
        <a href="index.html" class="home-btn">Anasayfaya Dön</a>
        <a href="admin_panel.php" class="back-btn">Admin Paneline Dön</a>
        <h2>Belge Ekle</h2>
        <form action="add_document.php" method="POST" enctype="multipart/form-data">
            <label for="document_name">Belge Adı:</label>
            <input type="text" id="document_name" name="document_name" required>

            <label for="document_pdf">Belge (PDF):</label>
            <input type="file" id="document_pdf" name="document_pdf" accept=".pdf" required>

            <label for="document_photo">Belge Fotoğrafı:</label>
            <input type="file" id="document_photo" name="document_photo" accept="image/*" required>

            <button type="submit">Belge Ekle</button>
        </form>
    </div>
</body>
</html>