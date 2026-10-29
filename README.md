# Wipe Radar

Türkçe Rust sunucusu keşif prototipi.

## Bilgisayarında açma (kurulum gerektirmez)

Hazırlanan yerel paketi ZIP'ten çıkar ve `Wipe-Radar.html` dosyasına çift tıkla. Chrome, Edge, Firefox veya Safari ile açabilirsin. Terminal, Node.js, internet veya sunucu gerekmez. Bu dosya kendi bilgisayarında çalışır; web'e yayımlanmaz.

Favoriler tarayıcı depolaması izin veriyorsa aynı tarayıcıda saklanır. Gizli mod, dosyanın taşınması veya tarayıcının yerel dosya kuralları kayıtları etkileyebilir. Depolama kapalıysa favoriler yalnızca açık oturumda tutulur.

## Kaynak koddan geliştirme

Node.js 22+ gerekir; harici paket kurulumu yoktur. Proje klasöründe:

```sh
npm start
# Port: 3000 (PORT değişkeniyle değiştirilebilir)
npm test

# Çift tıklanarak açılan tek dosyalık sürümü yeniden üret:
npm run export:local
# Çıktı: dist/Wipe-Radar.html
```

Bölge, maksimum sunucu kapasitesi, wipe aralığı, toplama oranı (1x–10x), vanilla/modlu türü ve isim/mod araması birlikte çalışır. Türkçe/İngilizce dil tercihi tarayıcıda saklanır. Yeni wipe, oyuncu sayısı veya kapasiteye göre sıralama; tarayıcıda saklanan favoriler ve üç geçmiş wipe'ın tamamını karşılaştıran saatlik oyuncu grafikleri içerir. Mobil ekranları ve klavyeyle kullanımı destekler.

**Tüm sunucu sayıları, wipe zamanları ve geçmiş grafikler demo verisidir.** Gerçek zamanlı sorgu, eksiksiz sunucu dizini, bağlantı adresleri veya gerçek geçmiş veri entegrasyonu yoktur. `data.js` örnek veri ve filtreleme mantığını içerir. Grafik ortalaması, üç örnek geçmişin aynı saatlerindeki aritmetik ortalamasıdır; gelecek tahmini değildir.

Gerçek ürün için sunucu dizini ve düzenli oyuncu ölçümü yapan, wipe başlangıçlarını kaydeden bir arka uç gerekir. API anahtarları yalnızca sunucu tarafında tutulmalıdır. Sunucu kapsamı ve veri kaynağı seçimi ayrıca yapılmalıdır.

## GitHub Pages

`npm run build:pages` komutu, bağımsız HTML sürümünü `docs/index.html` dosyasına üretir. Değişikliklerden sonra bu komutu tekrar çalıştırıp güncellenen dosyayı commit et.

GitHub → Settings → Pages → Build and deployment → Source: **Deploy from a branch**, Branch: **main**, Folder: **/docs** → Save.

Site adresi: https://azizogluhasancinar-creator.github.io/Rust-Server/

Bu adres ancak GitHub Pages etkinleştirilip dağıtım tamamlandıktan sonra çalışır. Sayfa gerçek sunucu verisi yerine açıkça işaretlenmiş demo verilerini gösterir.

## Tam wipe grafikleri ve arka plan

Geçmiş veri örnekleri 7/14/30 günlük wipe süresinin tamamını saatlik aralıklarla kapsar (başlangıç ve bitiş dahil 169/337/721 nokta). Aynı boyuttaki grafikler süreye göre yatayda ölçeklenir. Üç wipe ortalaması, aynı geçen saatteki değerlerin ortalamasıdır. Fare imleci veya klavyeyle erişilebilir saat kaydırıcısı oyuncu sayısını gösterir.

`assets/rust-landscape.png`, kullanıcının gönderdiği manzara referans alınarak yapay zekâyla yeniden üretilmiş 1672×940 arka plandır; orijinal oyundan alınmış yüksek çözünürlüklü resmî bir görsel olduğu iddia edilmez. Siyah katman CSS ile uygulanır. Pages derlemesi görseli yerel varlık olarak kopyalar; tek HTML dışa aktarımı görseli dosyaya gömer. Harici font veya resim servisi gerekmez.
