import { IlanKarti } from '@/components/IlanKarti'
import { CALISMA_SEKILLERI, ILLER } from '@/lib/secenekler'
import { paylasim } from '@/lib/site'
import { slugify } from '@/lib/slugify'
import { ilanlariGetir } from '@/lib/veri'

export const metadata = {
  title: 'Fizyoterapist ilanları',
  // Filtreli adresler (?sehir=...) aynı sayfanın kopyası sayılmasın diye.
  alternates: { canonical: '/ilanlar' },
  openGraph: paylasim({
    baslik: 'Fizyoterapist ilanları',
    aciklama: 'Türkiye genelinde güncel fizyoterapist iş ilanları.',
    yol: '/ilanlar',
  }),
}

export default async function IlanlarSayfasi({
  searchParams,
}: {
  searchParams: Promise<{ sehir?: string; calisma?: string }>
}) {
  const { sehir, calisma } = await searchParams
  const ilanlar = await ilanlariGetir({ sehir: sehir || undefined, calismaSekli: calisma || undefined })

  return (
    <section className="kap bolum">
      <h1>Fizyoterapist ilanları</h1>
      <p className="soluk">Süresi dolan ilanlar otomatik olarak yayından kalkar.</p>

      <form className="filtre" method="get">
        <label>
          Şehir
          <select name="sehir" defaultValue={sehir ?? ''}>
            <option value="">Tüm şehirler</option>
            {ILLER.map((il) => (
              <option key={il} value={slugify(il)}>
                {il}
              </option>
            ))}
          </select>
        </label>
        <label>
          Çalışma şekli
          <select name="calisma" defaultValue={calisma ?? ''}>
            <option value="">Tümü</option>
            {CALISMA_SEKILLERI.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="buton">
          Filtrele
        </button>
      </form>

      {ilanlar.length ? (
        <div className="izgara izgara-ilan">
          {ilanlar.map((i) => (
            <IlanKarti key={i.id} ilan={i} />
          ))}
        </div>
      ) : (
        <p className="bos">Bu kriterlere uygun yayında ilan yok.</p>
      )}
    </section>
  )
}
