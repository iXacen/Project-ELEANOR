# 🌿 ELEANOR Akıllı Sera Projesi

**ELEANOR**, güneş enerjili, yapay zekâ destekli ve uzaktan yönetilebilen bir akıllı sera sistemidir. Bu proje, sürdürülebilir tarımı desteklemek, otomatikleştirilmiş tarım teknolojilerini geliştirmek ve verimliliği artırmak amacıyla tasarlanmıştır.

---

## 🚀 Özellikler

- 🔋 **Enerji Yönetimi**:
  - 8 adet güneş paneli servo motorlarla güneşi 90° açıyla takip eder.
  - 20 lityum pil ile enerji depolanır.
  - Pil seviyesi %20 altına düştüğünde şehir elektriğine geçiş yapılır (0–36V kademeli trafo ile).

- 🌡️ **Sensörler**:
  - DHT22 (ısı ve nem)
  - Işık sensörü (LDR)
  - CO₂ sensörü
  - Hava kalitesi sensörü

- 🌀 **Otomasyon Motorları**:
  - 2 pencere motoru (otomatik havalandırma)
  - 1 su pompası (ana sulama)
  - 2 vitamin/mineral pompası
  - 1 LED ışık sistemi (lümen yetersizliğinde aktif)
  - 2 fan motoru (hava sirkülasyonu)

- 📲 **Kontrol Sistemleri**:
  - Python tabanlı kontrol altyapısı
  - Raspberry Pi 5 ile çalışır
  - Mobil uygulama (Flutter) ve masaüstü arayüz desteği
  - Anlık sistem durumu takibi, kontrol ve bildirimler

- 📈 **Veri Kaydı ve Analiz**:
  - Tüm veriler JSON/CSV formatında dışa aktarılabilir
  - Günlük kayıt ve log sistemi
  - Yapay zekâ ile otomatik karar desteği

---

## 🧰 Kurulum

1. Gerekli kütüphaneleri yükleyin:

```bash
pip install -r requirements.txt
🧠 Yapay Zekâ (ELEANOR)
Sistem, sensörlerden gelen verileri analiz ederek:

Optimal sıcaklık, nem ve ışık seviyelerini belirler.

Bu değerlere göre otomatik olarak sistem bileşenlerini çalıştırır.

Gelecekteki koşulları tahmin ederek kaynak kullanımını optimize eder.

🛠 Kullanılan Donanım
Raspberry Pi 5

8x Güneş Paneli + Servo Motor

DHT22, CO2, LDR, Hava Kalitesi Sensörleri

DC Motorlar (Pencere, Pompa, Fan)

Lityum Piller

Röle Modülleri ve PWM kontrol birimleri

🧪 Geliştirme Durumu
✅ Enerji izleme ve güneş takibi
✅ Sensör verileri okuma
✅ Fan ve pompa kontrolü
✅ Mobil uygulama bağlantısı (Flutter)
🔄 Yapay zekâ modelleme (devam ediyor)
🔄 MQTT/Socket ile uzak bağlantı (devam ediyor)

📞 İletişim
Proje Sorumlusu: NECATİ ÖZÜTOK
Mail: necatiozutok@gmail.com
GitHub: [github.com/iXacen]

