<?php
session_start();
if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
    header('Location: admin_giris.php');
    exit;
}

include 'baglanti.php';

// Silme işlemi
if (isset($_GET['delete_id'])) {
    $delete_id = $_GET['delete_id'];
    
    try {
        // Önce veritabanından belge bilgilerini al
        $stmt = $pdo->prepare("SELECT belge_pdf, belge_foto FROM belgeler WHERE id = ?");
        $stmt->execute([$delete_id]);
        $document = $stmt->fetch();
        
        // Dosyaları sunucudan sil
        if ($document) {
            if (file_exists('uploads/documents/' . $document['belge_pdf'])) {
                unlink('uploads/documents/' . $document['belge_pdf']);
            }
            if (file_exists('uploads/documents/' . $document['belge_foto'])) {
                unlink('uploads/documents/' . $document['belge_foto']);
            }
        }
        
        // Veritabanından sil
        $stmt = $pdo->prepare("DELETE FROM belgeler WHERE id = ?");
        $stmt->execute([$delete_id]);
        
        echo "<script>alert('Belge başarıyla silindi.'); window.location.href = 'view_documents.php';</script>";
    } catch (PDOException $e) {
        echo "<script>alert('Belge silinirken bir hata oluştu.');</script>";
    }
}

// Düzenleme işlemi
if (isset($_POST['update_document'])) {
    $document_id = $_POST['document_id'];
    $document_name = $_POST['document_name'];
    
    $document_pdf = $_FILES['document_pdf']['name'] ?? '';
    $document_photo = $_FILES['document_photo']['name'] ?? '';
    
    $tmp_pdf = $_FILES['document_pdf']['tmp_name'] ?? '';
    $tmp_photo = $_FILES['document_photo']['tmp_name'] ?? '';
    
    if ($document_pdf && $document_photo) {
        move_uploaded_file($tmp_pdf, 'uploads/documents/' . $document_pdf);
        move_uploaded_file($tmp_photo, 'uploads/documents/' . $document_photo);
        
        $stmt = $pdo->prepare("UPDATE belgeler SET belge_adi = ?, belge_pdf = ?, belge_foto = ? WHERE id = ?");
        $stmt->execute([$document_name, $document_pdf, $document_photo, $document_id]);
    } elseif ($document_pdf) {
        move_uploaded_file($tmp_pdf, 'uploads/documents/' . $document_pdf);
        
        $stmt = $pdo->prepare("UPDATE belgeler SET belge_adi = ?, belge_pdf = ? WHERE id = ?");
        $stmt->execute([$document_name, $document_pdf, $document_id]);
    } elseif ($document_photo) {
        move_uploaded_file($tmp_photo, 'uploads/documents/' . $document_photo);
        
        $stmt = $pdo->prepare("UPDATE belgeler SET belge_adi = ?, belge_foto = ? WHERE id = ?");
        $stmt->execute([$document_name, $document_photo, $document_id]);
    } else {
        $stmt = $pdo->prepare("UPDATE belgeler SET belge_adi = ? WHERE id = ?");
        $stmt->execute([$document_name, $document_id]);
    }
    
    echo "<script>alert('Belge başarıyla güncellendi.'); window.location.href = 'view_documents.php';</script>";
}

// Belgeleri listeleme
$stmt = $pdo->query("SELECT * FROM belgeler ORDER BY created_at DESC");
$documents = $stmt->fetchAll();
?>

<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Belgeler</title>
    <link rel="stylesheet" href="css/admin.css" />
</head>
<body>
    <div class="view-products">
        <a href="admin_giris.php?logout=true" class="logout-btn">Çıkış Yap</a>
        <a href="index.html" class="home-btn">Anasayfaya Dön</a>
        <a href="admin_panel.php" class="back-btn">Admin Paneline Dön</a>
        <h2>Belgeler</h2>
        <table>
            <thead>
                <tr>
                    <th>Belge Adı</th>
                    <th>PDF</th>
                    <th>Fotoğraf</th>
                    <th>Eklenme Tarihi</th>
                    <th>İşlemler</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($documents as $document): ?>
                    <tr>
                        <td><?php echo htmlspecialchars($document['belge_adi']); ?></td>
                        <td>
                            <?php if(!empty($document['belge_pdf'])): ?>
                                <a href="uploads/documents/<?php echo htmlspecialchars($document['belge_pdf']); ?>" target="_blank">PDF'i Görüntüle</a>
                            <?php endif; ?>
                        </td>
                        <td>
                            <?php if(!empty($document['belge_foto'])): ?>
                                <img src="uploads/documents/<?php echo htmlspecialchars($document['belge_foto']); ?>" class="product-thumb" alt="Belge Fotoğrafı">
                            <?php endif; ?>
                        </td>
                        <td><?php echo htmlspecialchars($document['created_at']); ?></td>
                        <td>
                            <a href="view_documents.php?delete_id=<?php echo $document['id']; ?>" class="delete-btn" onclick="return confirm('Bu belgeyi silmek istediğinizden emin misiniz?');">Sil</a>
                            <a href="#" class="edit-btn" 
                               onclick="openEditPopup(
                                   <?php echo $document['id']; ?>,
                                   '<?php echo addslashes(htmlspecialchars($document['belge_adi'])); ?>',
                                   '<?php echo addslashes(htmlspecialchars($document['belge_pdf'])); ?>',
                                   '<?php echo addslashes(htmlspecialchars($document['belge_foto'])); ?>'
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
            <h3>Belge Düzenle</h3>
            <form action="view_documents.php" method="POST" enctype="multipart/form-data">
                <input type="hidden" id="document_id" name="document_id">

                <label for="document_name">Belge Adı:</label>
                <input type="text" id="document_name" name="document_name" required>

                <label for="document_pdf">Yeni PDF (Opsiyonel):</label>
                <input type="file" id="document_pdf" name="document_pdf" accept=".pdf">

                <label for="document_photo">Yeni Fotoğraf (Opsiyonel):</label>
                <input type="file" id="document_photo" name="document_photo" accept="image/*">

                <button type="submit" name="update_document">Güncelle</button>
            </form>
        </div>
    </div>

    <script>
        function openEditPopup(id, name, pdf, photo) {
            document.getElementById('document_id').value = id;
            document.getElementById('document_name').value = name;
            document.getElementById('edit-popup').style.display = 'flex';
        }

        function closeEditPopup() {
            document.getElementById('edit-popup').style.display = 'none';
        }
    </script>
</body>
</html>