import Link from 'next/link'

import { IlanKarti } from '@/components/IlanKarti'
import { YaziKarti } from '@/components/YaziKarti'
import { SITE } from '@/lib/site'
import { ilanlariGetir, yazilariGetir } from '@/lib/veri'

export const metadata = { alternates: { canonical: '/' } }

export default async function AnaSayfa() {
  const [yazilar, ilanlar] = await Promise.all([yazilariGetir({ limit: 3 }), ilanlariGetir({ limit: 4 })])

  return (
    <>
      <section className="hero">
        <div className="kap">
          <h1>{SITE.slogan}</h1>
          <p className="hero-alt">{SITE.aciklama}</p>
          <div className="hero-butonlar">
            <Link href="/ilanlar" className="buton">
              İlanlara göz at
            </Link>
            <Link href="/yazilar" className="buton buton-ikincil">
              Yazıları oku
            </Link>
          </div>
        </div>
      </section>

      <section className="kap bolum">
        <div className="bolum-baslik">
          <h2>Güncel ilanlar</h2>
          <Link href="/ilanlar">Tüm ilanlar →</Link>
        </div>
        {ilanlar.length ? (
          <div className="izgara izgara-ilan">
            {ilanlar.map((i) => (
              <IlanKarti key={i.id} ilan={i} />
            ))}
          </div>
        ) : (
          <p className="bos">Şu an yayında ilan yok.</p>
        )}
      </section>

      <section className="kap bolum">
        <div className="bolum-baslik">
          <h2>Son yazılar</h2>
          <Link href="/yazilar">Tüm yazılar →</Link>
        </div>
        <div className="izgara">
          {yazilar.map((y) => (
            <YaziKarti key={y.id} yazi={y} />
          ))}
        </div>
      </section>
    </>
  )
}
