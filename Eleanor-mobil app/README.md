# ELEANOR Mobil Uygulaması

Bu proje, **ELEANOR Akıllı Sera Sistemi** için geliştirilen **mobil kontrol uygulamasıdır**. Uygulama, sensör verilerini görüntüleme, sera içi motorları kontrol etme ve enerji yönetimi ile uzaktan kontrol imkanı sunar.

## 🚀 Özellikler:
- 📡 **Gerçek zamanlı veri görüntüleme** (sıcaklık, nem, CO2 seviyesi, ışık durumu)
- 🔧 **Pencere, fan, su ve besin pompası motorlarının uzaktan kontrolü**
- ☀️ **Güneş paneli yönlendirme ve enerji yönetimi**
- 🌍 **MQTT ve Web API ile Raspberry Pi entegrasyonu**
- 🔔 **Bildirim sistemi ile düşük enerji seviyesi veya kritik durum uyarıları**
- 📱 **Kullanıcı dostu mobil arayüz**

## 📦 Kurulum:
### 1. **Bağımlılıkları Yükleme**
Aşağıdaki komut ile proje bağımlılıklarını yükleyin:
```bash
npm install

ELEANOR-Mobile/
│── lib/               # Flutter kaynak kodları
│── assets/            # Uygulama ikonları ve görseller
│── config/            # MQTT ve API bağlantı ayarları
│── main.dart          # Uygulamanın giriş noktası
│── README.md          # Proje dökümantasyonu