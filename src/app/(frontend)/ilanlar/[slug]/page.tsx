import { RichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'

import { KalanGun, sehirAdi } from '@/components/IlanKarti'
import { JsonLd } from '@/components/JsonLd'
import { CALISMA_SEKILLERI, etiket } from '@/lib/secenekler'
import { paylasim, siteAdresi } from '@/lib/site'
import { ilanGetir, tarihYaz } from '@/lib/veri'
import type { Ilanlar } from '@/payload-types'

type Props = { params: Promise<{ slug: string }> }

const CALISMA_TURU: Record<Ilanlar['calismaSekli'], string> = {
  'tam-zamanli': 'FULL_TIME',
  'yari-zamanli': 'PART_TIME',
  serbest: 'CONTRACTOR',
  staj: 'INTERN',
}

/** Google İş İlanları için schema.org JobPosting. validThrough sayesinde süresi dolan ilan Google'dan da düşer. */
function isIlaniVerisi(ilan: Ilanlar) {
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: ilan.baslik,
    description: convertLexicalToHTML({ data: ilan.aciklama }),
    datePosted: ilan.createdAt,
    validThrough: ilan.bitisTarihi,
    employmentType: CALISMA_TURU[ilan.calismaSekli],
    hiringOrganization: { '@type': 'Organization', name: ilan.kurum },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: ilan.ilce || sehirAdi(ilan.sehir),
        addressRegion: sehirAdi(ilan.sehir),
        addressCountry: 'TR',
      },
    },
    url: `${siteAdresi()}/ilanlar/${ilan.slug}`,
    ...(ilan.iletisim?.basvuruLinki ? { directApply: false } : {}),
  }
}

export async function generateMetadata({ params }: Props) {
  const ilan = await ilanGetir((await params).slug)
  if (!ilan) return {}
  const yer = `${sehirAdi(ilan.sehir)}${ilan.ilce ? ` / ${ilan.ilce}` : ''}`
  const aciklama =
    ilan.seo?.aciklama ||
    `${ilan.kurum} · ${yer} · ${etiket(CALISMA_SEKILLERI, ilan.calismaSekli)} · Son başvuru: ${tarihYaz(ilan.bitisTarihi)}`
  const baslik = ilan.seo?.baslik || `${ilan.baslik} · ${ilan.kurum}`
  return {
    title: baslik,
    description: aciklama,
    alternates: { canonical: `/ilanlar/${ilan.slug}` },
    openGraph: paylasim({
      baslik: ilan.seo?.baslik || ilan.baslik,
      aciklama,
      yol: `/ilanlar/${ilan.slug}`,
      ust: `${ilan.kurum} · ${yer}`,
      tur: 'article',
    }),
  }
}

export default async function IlanSayfasi({ params }: Props) {
  // Süresi dolan ilan burada bulunamaz, ziyaretçi "sayfa bulunamadı" görür.
  const ilan = await ilanGetir((await params).slug)
  if (!ilan) notFound()
  const { telefon, eposta, basvuruLinki } = ilan.iletisim ?? {}

  return (
    <article className="kap dar bolum">
      <JsonLd veri={isIlaniVerisi(ilan)} />
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
