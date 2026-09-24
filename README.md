# Fizyo Rehber

Fizyoterapi yazıları ve fizyoterapist iş ilanları sitesi. Next.js ve [Payload CMS](https://payloadcms.com) ile yapıldı. Site sahibi iki içerik türünü tek bir yönetim panelinden (`/admin`) yönetir.

| Bölüm | Ne işe yarar |
|---|---|
| **Yazılar** | Blog yazıları: başlık, özet, kapak görseli, zengin metin içerik, kategori, yazar |
| **İlanlar** | İş ilanları: kurum, şehir/ilçe, çalışma şekli, açıklama, iletişim, **bitiş tarihi** |
| **Medya** | Yüklenen görseller |
| **Kullanıcılar** | Panele girebilen kişiler |

Ekran görüntüleri `ekran-goruntuleri/` klasöründe.

## İlan süresi nasıl işler?

- Her ilanın bir **bitiş tarihi** vardır. Boş bırakılırsa 30 gün sonrası atanır (`src/lib/ilanSuresi.ts`).
- Bitiş tarihi geçen ilan sitede **o anda** görünmez olur. Ziyaretçi erişim kuralı `src/collections/Ilanlar.ts` içindedir. Ayrıca bir işlem gerekmez.
- İlan silinmez, panelde **"Süre durumu: Süresi doldu"** olarak kalır. Tarihi ileri alıp kaydedince tekrar **Aktif** olur ve sitede görünür.
- Vercel Cron her gece 03:00'te (UTC) `/api/ilanlar/suresi-dolanlari-kapat` adresini çağırır. Bu çağrı, süresi dolan ilanların paneldeki durumunu günceller (`vercel.json`). Adres sadece `CRON_SECRET` ile ya da panele giriş yapmış kullanıcıyla çalışır.

## Yerelde çalıştırma

Gereksinimler: Node.js 20 veya üstü, pnpm.

```bash
pnpm install
cp .env.example .env      # PAYLOAD_SECRET değerini değiştirin
pnpm seed                 # örnek yazı ve ilanları yükler
pnpm dev
```

- Site: http://localhost:3000
- Panel: http://localhost:3000/admin
  - Örnek yönetici: `admin@fizyo.test` / `fizyo1234`. Seed sırasında `SEED_ADMIN_EMAIL` ve `SEED_ADMIN_PASSWORD` ile değiştirilebilir.

`pnpm seed` mevcut yazı, ilan ve görselleri **silip** örnek içeriği yeniden yükler. Gerçek içerik girildikten sonra çalıştırmayın.

## Vercel'e yükleme

Yerelde veritabanı olarak bir SQLite dosyası kullanılır. Vercel'de dosya sistemi kalıcı olmadığı için:

1. **Veritabanı: [Turso](https://turso.tech)** (bulutta SQLite, ücretsiz planı var). Bir veritabanı oluşturun, adresini (`libsql://...`) ve token'ını alın.
2. **Görseller: Vercel Blob.** Vercel projesinde Storage → Blob oluşturun. `BLOB_READ_WRITE_TOKEN` otomatik eklenir.
3. Vercel'de şu ortam değişkenlerini tanımlayın:

   | Değişken | Değer |
   |---|---|
   | `DATABASE_URL` | `libsql://...turso.io` |
   | `DATABASE_AUTH_TOKEN` | Turso token'ı |
   | `PAYLOAD_SECRET` | Uzun, rastgele bir değer |
   | `BLOB_READ_WRITE_TOKEN` | Vercel Blob'un eklediği değer |
   | `CRON_SECRET` | Uzun, rastgele bir değer (Vercel Cron bunu otomatik gönderir) |

4. Deploy edin. `vercel-build` betiği önce veritabanı tablolarını oluşturur (`payload migrate`), sonra siteyi derler.
5. İlk yönetici hesabını `/admin` adresinden oluşturun. İsterseniz örnek içerik için, aynı ortam değişkenleriyle yerelde `pnpm seed` çalıştırın.

## Koleksiyon alanlarını değiştirme

Bir alan ekleyip çıkardıktan sonra:

```bash
pnpm generate:types                      # src/payload-types.ts güncellenir
pnpm payload migrate:create alan-adi     # canlı veritabanı için migration
```

Yerelde (geliştirme modunda) tablo yapısı otomatik güncellenir. Canlıda migration dosyası gerekir.

## Testler

```bash
pnpm test:int   # yardımcı fonksiyonlar ve ilan süresi kuralları (ayrı test.db kullanır)
pnpm test:e2e   # tarayıcı testleri: site ve panel (pnpm seed sonrası çalıştırın)
pnpm lint
```

## Dosya yapısı

```
src/
  collections/   Yazilar, Ilanlar, Media, Users (panel alanları burada)
  app/(frontend) ziyaretçi sayfaları: ana sayfa, /yazilar, /ilanlar
  app/(payload)  yönetim paneli ve API (Payload tarafından üretildi)
  lib/           slug, ilan süresi, seçenek listeleri, veri çekme
  seed/          örnek içerik
  migrations/    canlı veritabanı şeması
```

Site adı ve açıklaması `src/lib/site.ts` dosyasındadır.
