import { RichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { JsonLd } from '@/components/JsonLd'
import { etiket, YAZI_KATEGORILERI } from '@/lib/secenekler'
import { paylasim, SITE, siteAdresi } from '@/lib/site'
import { gorsel, paylasimGorseli, tarihYaz, yaziGetir } from '@/lib/veri'
import type { Yazilar } from '@/payload-types'

type Props = { params: Promise<{ slug: string }> }

const tamAdres = (url: string) => (url.startsWith('/') ? `${siteAdresi()}${url}` : url)

/** schema.org Article: Google'a yazının başlığını, yazarını, tarihini ve görselini bildirir. */
function makaleVerisi(yazi: Yazilar) {
  const kapak = paylasimGorseli(yazi.kapakGorseli) ?? gorsel(yazi.kapakGorseli, 'genis')
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: yazi.baslik,
    description: yazi.ozet,
    ...(kapak ? { image: [tamAdres(kapak.url)] } : {}),
    datePublished: yazi.yayinTarihi ?? yazi.createdAt,
    dateModified: yazi.updatedAt,
    ...(yazi.yazar ? { author: { '@type': 'Person', name: yazi.yazar } } : {}),
    publisher: { '@type': 'Organization', name: SITE.ad, url: siteAdresi() },
    mainEntityOfPage: `${siteAdresi()}/yazilar/${yazi.slug}`,
  }
}

export async function generateMetadata({ params }: Props) {
  const yazi = await yaziGetir((await params).slug)
  if (!yazi) return {}
  const baslik = yazi.seo?.baslik || yazi.baslik
  const aciklama = yazi.seo?.aciklama || yazi.ozet
  return {
    title: baslik,
    description: aciklama,
    alternates: { canonical: `/yazilar/${yazi.slug}` },
    openGraph: paylasim({
      baslik,
      aciklama,
      yol: `/yazilar/${yazi.slug}`,
      gorsel: paylasimGorseli(yazi.kapakGorseli),
      ust: etiket(YAZI_KATEGORILERI, yazi.kategori),
      tur: 'article',
    }),
  }
}

export default async function YaziSayfasi({ params }: Props) {
  const yazi = await yaziGetir((await params).slug)
  if (!yazi) notFound()
  const kapak = gorsel(yazi.kapakGorseli, 'genis')

  return (
    <article className="kap dar bolum">
      <JsonLd veri={makaleVerisi(yazi)} />
      <Link href="/yazilar" className="geri">
        ← Tüm yazılar
      </Link>
      <span className="rozet">{etiket(YAZI_KATEGORILERI, yazi.kategori)}</span>
      <h1>{yazi.baslik}</h1>
      <p className="meta">
        {yazi.yazar ? `${yazi.yazar} · ` : ''}
        {tarihYaz(yazi.yayinTarihi)}
      </p>
      {kapak && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={kapak.url} alt={kapak.alt} className="yazi-kapak" />
      )}
      <div className="icerik">
        <RichText data={yazi.icerik} />
      </div>
    </article>
  )
}
