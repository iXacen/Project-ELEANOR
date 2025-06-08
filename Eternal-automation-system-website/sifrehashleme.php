<?php
$hashed_password = password_hash('1234', PASSWORD_DEFAULT);
echo $hashed_password;
?>

<!-- 1234 yerine istediğin şifreyi gir sonra localhostta sifrehashleme.php sayfasına 
 gidip hashlenmiş şifreyi al ve admingiris.php sayfasında ilgili yere yapıştır 
 bu sayfayı da sil daha sonra-->