# Bizim Hikâyemiz

## GitHub Pages yayını

Next.js 16.3.8 / App Router, `output: "export"` ile statik olarak derlenir. Çıktı `out/` klasörüdür; ayrı bir `next export` komutu gerekmez. `next.config.ts` içinde `trailingSlash: true`, `images.unoptimized: true` ve production için `/anniversary-site` basePath/assetPrefix ayarlanmıştır. Fotoğraflar önceden hazırlanmış WebP dosyaları olarak sunulur; sunucuda görsel optimizasyonu gerekmez.

`lib/asset-path.ts`, galeri ve modalın ortak `MemoryPhoto` bileşeniyle müziğe aynı öneki ekler. Repository adı değişirse buradaki `productionBasePath` değerini değiştirip yeniden build alın. Geliştirmede önek boş kalır: `npm run dev` → `http://localhost:3000`.

1. Projeyi `anniversary-site` adlı GitHub repository'sinin `main` dalına gönderin. `public/photos`, `public/music/our-song.mp3`, `data/photos.json` ve `package-lock.json` dosyalarının da repository'ye eklendiğinden emin olun. `out` ve `node_modules` yüklenmez.
2. **Settings → Pages → Build and deployment → Source → GitHub Actions** seçin.
3. `.github/workflows/deploy.yml`, her `main` push'unda (ve Actions üzerinden manuel olarak) Node 22, `npm ci`, lint, test, build ve export doğrulamasını çalıştırır. `out/` artifact'ini resmi Pages Actions ile yayınlar.
4. Başarılı deploy sonrasında adres: `https://KULLANICI-ADI.github.io/anniversary-site/`.

Yerel üretim kontrolü: `npm run build`, `npm run check:export`, ardından `npm start`. Statik önizleme `http://localhost:3001/anniversary-site/` adresindedir; `PORT` ile port değiştirilebilir. Static export için `next start` kullanılmaz. Önizleme müzikte byte-range isteklerini de destekler.

Kontrol betiği, export içindeki CSS/JS, favicon, müzik ve bütün galeri/modal dosyalarının doğru önekle mevcut olduğunu denetler. Tasarım, tarih kapısı, sayaç, yıldızlar ve mektup animasyonları tarayıcıda çalışmaya devam eder.

Resmi referans: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

Next.js App Router + TypeScript + Tailwind. `npm run dev` ile http://localhost:3000 adresinde çalışır.

## Akış

07.10.2023 tarih kapısı → kulaklık → Hazırım ile müzik → sinematik açılış → canlı sayaç → Anılarımız.
Timeline ve kronolojik örnek anılar kaldırıldı. Tarih kapısı bir etkileşimdir; güvenlik/kimlik doğrulama sağlamaz.

## İçerik

- `data/relationship.ts`: kapı, açılış ve sayaç için merkezi tarih/saat dilimi. `start` ve `displayDate` birlikte değiştirilmeli.
- `fotoğraflar/`: orijinal dosyalar; hazırlama betiği yalnızca okur.
- `scripts/prepare-photos.mjs`: JPG/PNG/HEIC dosyalarını yerel olarak dönüştürür. Çalıştırma: `npm run photos:prepare`. Video dosyalarını fotoğraf galerisine eklemez.
- `public/photos/album/`: 720×960 sınırları içinde küçük WebP kopyaları; modal için 2400×2400 sınırları içinde yüksek kaliteli WebP kopyaları. Görüntüler büyütülmez; JPEG/PNG yönü EXIF'e göre düzeltilir.
- `data/photos.json`: üretilen fotoğraf manifesti. Başlıklar dosya adından gelir. Yalnızca kesin YYYY-MM-DD tarihleri ayrıştırılır; diğer tarihler boş kalır. Kişisel hikâye üretilmez. Elle düzenlenebilir; hazırlama betiğinin yeniden çalıştırılması bu düzenlemeleri değiştirir.
- `data/memories.ts` ve `lib/stable-shuffle.ts`: sabit tohumlu Fisher–Yates sırası (7102023), modül yüklenirken bir kez üretilir. Render sırasında rastgelelik yoktur.
- `public/music/our-song.mp3`: mevcut müzik konumu.

Next/Image ve lazy loading kullanılır. Galeri küçük kopyayı, yalnızca açılan modal büyük kopyayı yükler. Modal ESC/dışarı tıklama ile kapanır ve odağı karta geri verir.

## Görsel sistem

Yıldızlar `components/BackgroundEffects.tsx` ve `app/globals.css` üzerinden yönetilir. Masaüstünde 48, mobilde 28 yıldız; farklı süre/gecikme/opaklık, reduced-motion desteği.

Ana palet: #5C7057, #89A482, #ACC5A6, #D1EDD3. Derin arka plan #101710. Üst başlık ve StorySection kaldırıldı. Galeri masaüstünde 3, tablette/mobilde 2, 360 px altında 1 sütundur. Fotoğraf alanları 4:5 oranında, kart başlık alanları eşit yüksekliktedir; başlıklar kısaltılmadan görünür. Kartlar düz durur, kaydırmada 75 ms aralıklı geçiş ve hover animasyonu kullanır.

## Kontroller

`npm run lint`, `npm run build`, `npm test` (Node 22.18+).
Sayaç testleri takvim ayı, artık yıl, ay sonu ve saat dilimini kapsar. Albüm testleri sıra kararlılığını, fotoğraf bütünlüğünü ve yeni yıl dönümünü kontrol eder.
