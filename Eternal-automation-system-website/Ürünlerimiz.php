<?php
include("baglanti.php");

$sql = "SELECT isim, bilgi, foto , foto2 FROM urunler";
$result = $conn->query($sql);
?>
<?php include('header.php'); ?>
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>Referanslarımız</title> 
</head>
<body>

<div class="products-container">
  <h1>REFERANSLARIMIZ</h1>
<div class="products-grid">
  <?php if ($result->num_rows > 0): ?>
    <?php while($row = $result->fetch_assoc()): ?>
      <div class="product-card">
        <h2><?= htmlspecialchars($row['isim']) ?></h2>
        <div class="image-wrapper">
          <img class="img-normal" src="uploads/<?= htmlspecialchars($row['foto']) ?>" alt="<?= htmlspecialchars($row['isim']) ?>">
          <img class="img-hover" src="uploads/<?= htmlspecialchars($row['foto2']) ?>" alt="<?= htmlspecialchars($row['isim']) ?>">
        </div>
        <p><?= htmlspecialchars($row['bilgi']) ?></p>
      </div>
    <?php endwhile; ?>
  <?php else: ?>
    <p>Henüz ürün eklenmedi.</p>
  <?php endif; ?>
</div>

</div>

<?php include('footer.php'); ?>
</body>
</html>
