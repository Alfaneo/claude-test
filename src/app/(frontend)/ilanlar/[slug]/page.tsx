import { RichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { KalanGun, sehirAdi } from '@/components/IlanKarti'
import { CALISMA_SEKILLERI, etiket } from '@/lib/secenekler'
import { ilanGetir, tarihYaz } from '@/lib/veri'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const ilan = await ilanGetir((await params).slug)
  return ilan ? { title: `${ilan.baslik} · ${ilan.kurum}` } : {}
}

export default async function IlanSayfasi({ params }: Props) {
  // Süresi dolan ilan burada bulunamaz, ziyaretçi "sayfa bulunamadı" görür.
  const ilan = await ilanGetir((await params).slug)
  if (!ilan) notFound()
  const { telefon, eposta, basvuruLinki } = ilan.iletisim ?? {}

  return (
    <article className="kap dar bolum">
      <Link href="/ilanlar" className="geri">
        ← Tüm ilanlar
      </Link>
      <div className="ilan-ust">
        <span className="rozet">{etiket(CALISMA_SEKILLERI, ilan.calismaSekli)}</span>
        <KalanGun bitisTarihi={ilan.bitisTarihi} />
      </div>
      <h1>{ilan.baslik}</h1>
      <p className="kurum buyuk">{ilan.kurum}</p>
      <p className="meta">
        {sehirAdi(ilan.sehir)}
        {ilan.ilce ? ` / ${ilan.ilce}` : ''} · Son başvuru: {tarihYaz(ilan.bitisTarihi)}
      </p>

      <div className="icerik">
        <RichText data={ilan.aciklama} />
      </div>

      <aside className="iletisim-kutu">
        <h2>Başvuru ve iletişim</h2>
        <ul>
          {telefon && (
            <li>
              Telefon: <a href={`tel:${telefon.replace(/\s/g, '')}`}>{telefon}</a>
            </li>
          )}
          {eposta && (
            <li>
              E-posta: <a href={`mailto:${eposta}`}>{eposta}</a>
            </li>
          )}
          {basvuruLinki && (
            <li>
              <a href={basvuruLinki} target="_blank" rel="noopener noreferrer" className="buton">
                Online başvur
              </a>
            </li>
          )}
        </ul>
      </aside>
    </article>
  )
}
