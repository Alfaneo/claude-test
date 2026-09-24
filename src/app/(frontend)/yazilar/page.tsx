import Link from 'next/link'

import { YaziKarti } from '@/components/YaziKarti'
import { YAZI_KATEGORILERI } from '@/lib/secenekler'
import { yazilariGetir } from '@/lib/veri'

export const metadata = { title: 'Yazılar' }

export default async function YazilarSayfasi({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>
}) {
  const { kategori } = await searchParams
  const yazilar = await yazilariGetir({ kategori, limit: 100 })

  return (
    <section className="kap bolum">
      <h1>Yazılar</h1>
      <nav className="filtre-etiketler" aria-label="Kategoriler">
        <Link href="/yazilar" className={!kategori ? 'aktif' : ''}>
          Tümü
        </Link>
        {YAZI_KATEGORILERI.map((k) => (
          <Link key={k.value} href={`/yazilar?kategori=${k.value}`} className={kategori === k.value ? 'aktif' : ''}>
            {k.label}
          </Link>
        ))}
      </nav>
      {yazilar.length ? (
        <div className="izgara">
          {yazilar.map((y) => (
            <YaziKarti key={y.id} yazi={y} />
          ))}
        </div>
      ) : (
        <p className="bos">Bu kategoride henüz yazı yok.</p>
      )}
    </section>
  )
}
