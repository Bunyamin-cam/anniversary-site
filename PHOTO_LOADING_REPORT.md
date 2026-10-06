# Fotoğraf yükleme kontrolü

- Kaynak: 39 JPG + 1 PNG + 8 HEIC = 48 fotoğraf; 1 MP4 fotoğraf galerisine dahil değil.
- HEIC doğrudan sunulmaz. 48 fotoğrafın tamamı WebP kopyalarıyla temsil edilir.
- Public: 48 yüksek çözünürlüklü WebP ve 48 thumbnail; toplam 96 dosya, 48 galeri kartı.
- Manifest: data/photos.json. data/memories.ts bu manifesti mevcut sabit shuffle ile kullanır.
- Tüm URL'ler /photos/album/ ile başlar. Dosya adları hash tabanlı ASCII ve çakışma denetimli manifest kimlikleridir.
- Logda görülen sorun: fotoğraf hazırlama tamamlanmadan data/memories.ts tarafından data/photos.json import edilmesi. Güncel durumda eksik dosya veya hatalı path bulunmadı; fotoğrafların görünmemesi yeniden üretilemedi.
- Koruma: npm dev/build öncesinde manifest ve dosyalar doğrulanır, eksikse hazırlanır. Manifest sadece başarılı dönüşüm bitince atomik olarak yayımlanır.
- MemoryPhoto: Next/Image optimizasyon hatasında doğrudan public URL yeniden denenir; bu da başarısızsa mevcut fallback gösterilir.
- Orijinal fotoğraflar değiştirilmedi. Tasarım, renkler, yıldızlar, bölümler ve shuffle değiştirilmedi.

Doğrudan tarayıcıda açılan örnekler:
- /photos/album/19fdd6a3998a.webp
- /photos/album/d63ef3124e69.webp
- /photos/album/32170f036b8c.webp

Dosyalar: components/MemoryPhoto.tsx, scripts/prepare-photos.mjs, scripts/check-photos.mjs, package.json.
