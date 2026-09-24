import Link from 'next/link'

import { kalanGun } from '@/lib/ilanSuresi'
import { CALISMA_SEKILLERI, etiket, ILLER } from '@/lib/secenekler'
import { slugify } from '@/lib/slugify'
import type { Ilanlar } from '@/payload-types'

export const sehirAdi = (deger: string) => ILLER.find((il) => slugify(il) === deger) ?? deger

export function KalanGun({ bitisTarihi }: { bitisTarihi: string }) {
  const gun = kalanGun(bitisTarihi)
  return (
    <span className={`kalan ${gun <= 7 ? 'kalan-az' : ''}`}>
      {gun <= 1 ? 'Son gün' : `Son ${gun} gün`}
    </span>
  )
}

export function IlanKarti({ ilan }: { ilan: Ilanlar }) {
  return (
    <article className="kart ilan-karti">
      <Link href={`/ilanlar/${ilan.slug}`} className="kart-link">
        <div className="kart-govde">
          <div className="ilan-ust">
            <span className="rozet">{etiket(CALISMA_SEKILLERI, ilan.calismaSekli)}</span>
            <KalanGun bitisTarihi={ilan.bitisTarihi} />
          </div>
          <h3>{ilan.baslik}</h3>
          <p className="kurum">{ilan.kurum}</p>
          <p className="meta">
            {sehirAdi(ilan.sehir)}
            {ilan.ilce ? ` / ${ilan.ilce}` : ''}
          </p>
        </div>
      </Link>
    </article>
  )
}
