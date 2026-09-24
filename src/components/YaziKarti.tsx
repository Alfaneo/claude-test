import Link from 'next/link'

import { etiket, YAZI_KATEGORILERI } from '@/lib/secenekler'
import { gorsel, tarihYaz } from '@/lib/veri'
import type { Yazilar } from '@/payload-types'

export function YaziKarti({ yazi }: { yazi: Yazilar }) {
  const kapak = gorsel(yazi.kapakGorseli, 'kart')
  return (
    <article className="kart yazi-karti">
      <Link href={`/yazilar/${yazi.slug}`} className="kart-link">
        {kapak ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={kapak.url} alt={kapak.alt} className="kart-gorsel" loading="lazy" />
        ) : (
          <div className="kart-gorsel kart-gorsel-bos" />
        )}
        <div className="kart-govde">
          <span className="rozet">{etiket(YAZI_KATEGORILERI, yazi.kategori)}</span>
          <h3>{yazi.baslik}</h3>
          <p className="soluk">{yazi.ozet}</p>
          <p className="meta">
            {yazi.yazar ? `${yazi.yazar} · ` : ''}
            {tarihYaz(yazi.yayinTarihi)}
          </p>
        </div>
      </Link>
    </article>
  )
}
