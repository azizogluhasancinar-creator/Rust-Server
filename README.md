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

## Takım sınırı, harita ve wipe takvimi

62 örnek kayıt vardır: önceki 12 kayıt + 50 aday kayıt. EU/NA ağırlıklıdır; Türkiye filtresinde Cumhuriyet de bulunur. **Yeni adayların varlığı, IP adresleri ve gerçek popülerlik sırası doğrulanmamıştır.** Sunucu adları araştırma adaylarıdır; sayısal değerler ve özellikler örnek senaryolardır. Varsayılan sıralama örnek oyuncu sayısı azalan sıradadır. Kaynak doğrulanmadan gerçek IP yazılmaz; kartta “IP not verified” görünür. Doğrulanmış `address` olduğunda kartta gösterme/kopyalama arayüzü hazırdır.

Varsayılan dil İngilizce; açıkça kaydedilmiş Türkçe tercihi korunur. Solo/Duo/Trio/Quad, x oranı, sunucu türü ve bölge filtreleri birlikte uygulanır. Kartın tamamı ve klavyeyle odaklanılan kart düğmesi detayları açar. Favori ve IP düğmeleri bağımsızdır.

Harita etiketleri: 3000 m altı XSmall; 3000–3499 Small; 3500–4000 Medium; 4001–4999 Large; 5000 ve üstü XLarge. Detaylarda gerçek sayısal alan ve harita seed'i ayrı gösterilir. Seed bir harita oluşturma sayısıdır; IP değildir. Mevcut harita değerleri demo verisidir.

Geri sayımlar sabit `catalogSnapshotAt` UTC anına bağlanan örnek takvimden hesaplanır; sayfa yenilendiğinde sıfırlanmaz ve her saniye güncellenir. Periyot bitiminde mevcut/sonraki wipe ve BP döngüsü ilerler. `Map + blueprints` blueprint'lerin de silindiği map wipe'ı ifade eder. Bu takvimler sunucu sahiplerinden doğrulanmış gerçek zamanlar değildir. Tarihler ziyaretçinin tarayıcı saat diliminde, saat dilimi adıyla gösterilir.

Gerçek 50 sunucunun IP ve popülerlik verisini edinmek için BattleMetrics isteği denendi; ortam proxy'si `403 Forbidden` döndürdü. `api.battlemetrics.com` ve `www.battlemetrics.com` alan adları ortam ayarları taslağına eklendi. Taslağın kaydı tek başına çalışan ortamın ağ politikasını değiştirmez; uygulanıp gerçek istek başarılı olduktan sonra doğrulama yapılmalıdır. Bu erişim sağlanmadan “en popüler 50 gerçek sunucu” tamamlanmış sayılmaz.
