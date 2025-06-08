<?php
session_start();

// Eğer kullanıcı giriş yapmamışsa, giriş sayfasına yönlendir
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header('Location: admin_giris.php');
    exit;
}

// Veritabanı bağlantısı
include 'baglanti.php';

// Silme işlemi yapılacaksa
if (isset($_GET['delete_id'])) {
    $delete_id = $_GET['delete_id'];

    // Silme işlemi
    try {
        $stmt = $pdo->prepare("DELETE FROM urunler WHERE id = ?");
        $stmt->execute([$delete_id]);
        echo "<script>alert('Ürün başarıyla silindi.'); window.location.href = 'view_products.php';</script>";
    } catch (PDOException $e) {
        echo "<script>alert('Ürün silinirken bir hata oluştu.');</script>";
    }
}

// Düzenleme işlemi yapılacaksa
if (isset($_POST['update_product'])) {
    $product_id = $_POST['product_id'];
    $product_name = $_POST['product_name'];
    $product_description = $_POST['product_description'];

    $product_image = $_FILES['product_image']['name'] ?? '';
    $product_image2 = $_FILES['product_image2']['name'] ?? '';

    // Fotoğraf dosyalarının tmp_name değerleri (kontrol için)
    $tmp_image = $_FILES['product_image']['tmp_name'] ?? '';
    $tmp_image2 = $_FILES['product_image2']['tmp_name'] ?? '';

    // Güncelleme sorgusunu dinamik yapalım
    if ($product_image && $product_image2) {
        // İki fotoğraf da yüklendi
        move_uploaded_file($tmp_image, 'uploads/' . $product_image);
        move_uploaded_file($tmp_image2, 'uploads/' . $product_image2);

        $stmt = $pdo->prepare("UPDATE urunler SET isim = ?, bilgi = ?, foto = ?, foto2 = ? WHERE id = ?");
        $stmt->execute([$product_name, $product_description, $product_image, $product_image2, $product_id]);

    } elseif ($product_image) {
        // Sadece birinci fotoğraf yüklendi
        move_uploaded_file($tmp_image, 'uploads/' . $product_image);

        $stmt = $pdo->prepare("UPDATE urunler SET isim = ?, bilgi = ?, foto = ? WHERE id = ?");
        $stmt->execute([$product_name, $product_description, $product_image, $product_id]);

    } elseif ($product_image2) {
        // Sadece ikinci fotoğraf yüklendi
        move_uploaded_file($tmp_image2, 'uploads/' . $product_image2);

        $stmt = $pdo->prepare("UPDATE urunler SET isim = ?, bilgi = ?, foto2 = ? WHERE id = ?");
        $stmt->execute([$product_name, $product_description, $product_image2, $product_id]);

    } else {
        // Fotoğraf yüklenmedi, sadece isim ve açıklama güncellenecek
        $stmt = $pdo->prepare("UPDATE urunler SET isim = ?, bilgi = ? WHERE id = ?");
        $stmt->execute([$product_name, $product_description, $product_id]);
    }

    echo "<script>alert('Ürün başarıyla güncellendi.'); window.location.href = 'view_products.php';</script>";
}

// Ürünleri veritabanından çekme
$stmt = $pdo->query("SELECT * FROM urunler");
$products = $stmt->fetchAll();
?>

<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Ürünler</title>
    <link rel="stylesheet" href="css/admin.css" />
</head>
<body>
    <div class="view-products">
        <a href="admin_giris.php?logout=true" class="logout-btn">Çıkış Yap</a>
        <a href="index.html" class="home-btn">Anasayfaya Dön</a>
        <h2>Ürünler</h2>
        <table>
            <thead>
                <tr>
                    <th>Ürün Adı</th>
                    <th>Açıklama</th>
                    <th>Görseller</th>
                    <th>Eklenme Tarihi</th>
                    <th>İşlemler</th> <!-- Silme ve Düzenleme butonları -->
                </tr>
            </thead>
            <tbody>
                <?php foreach ($products as $product): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($product['isim']); ?></td>
                        <td><?php echo htmlspecialchars($product['bilgi']); ?></td>
                        <td class="image-cell">
                            <?php if(!empty($product['foto'])): ?>
                                <img src="uploads/<?php echo htmlspecialchars($product['foto']); ?>" class="product-thumb" alt="Ürün Görseli 1">
                            <?php endif; ?>
                            <?php if(!empty($product['foto2'])): ?>
                                <img src="uploads/<?php echo htmlspecialchars($product['foto2']); ?>" class="product-thumb" alt="Ürün Görseli 2">
                            <?php endif; ?>
                        </td>
                        <td><?php echo htmlspecialchars($product['eklenme_tarihi']); ?></td>
                        <td>
                            <!-- Silme butonu -->
                            <a href="view_products.php?delete_id=<?php echo $product['id']; ?>" class="delete-btn" onclick="return confirm('Bu ürünü silmek istediğinizden emin misiniz?');">Sil</a>
                            <!-- Düzenleme butonu -->
                            <a href="#" class="edit-btn" 
                               onclick="openEditPopup(
                                   <?php echo $product['id']; ?>,
                                   '<?php echo addslashes(htmlspecialchars($product['isim'])); ?>',
                                   '<?php echo addslashes(htmlspecialchars($product['bilgi'])); ?>',
                                   '<?php echo addslashes(htmlspecialchars($product['foto'])); ?>',
                                   '<?php echo addslashes(htmlspecialchars($product['foto2'])); ?>'
                               )">Düzenle</a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>

    <!-- Düzenleme Popup Formu -->
    <div id="edit-popup" class="popup">
        <div class="popup-content">
            <span class="close" onclick="closeEditPopup()">&times;</span>
            <h3>Ürün Düzenle</h3>
            <form action="view_products.php" method="POST" enctype="multipart/form-data">
                <input type="hidden" id="product_id" name="product_id">

                <label for="product_name">Ürün Adı:</label>
                <input type="text" id="product_name" name="product_name" required>

                <label for="product_description">Ürün Açıklaması:</label>
                <textarea id="product_description" name="product_description" required></textarea>

                <label for="product_image">Birinci Ürün Görseli (Opsiyonel):</label>
                <input type="file" id="product_image" name="product_image">

                <label for="product_image2">İkinci Ürün Görseli (Opsiyonel):</label>
                <input type="file" id="product_image2" name="product_image2">

                <button type="submit" name="update_product">Güncelle</button>
            </form>
        </div>
    </div>

    <script>
        function openEditPopup(id, name, description, foto1, foto2) {
            document.getElementById('product_id').value = id;
            document.getElementById('product_name').value = name;
            document.getElementById('product_description').value = description;
            // Fotoğrafları gösterme işlemi istenirse buraya eklenebilir
            document.getElementById('edit-popup').style.display = 'flex';
        }

        function closeEditPopup() {
            document.getElementById('edit-popup').style.display = 'none';
        }
    </script>
</body>
</html>
