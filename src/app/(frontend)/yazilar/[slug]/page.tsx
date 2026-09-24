import { RichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { etiket, YAZI_KATEGORILERI } from '@/lib/secenekler'
import { paylasim } from '@/lib/site'
import { gorsel, paylasimGorseli, tarihYaz, yaziGetir } from '@/lib/veri'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const yazi = await yaziGetir((await params).slug)
  if (!yazi) return {}
  return {
    title: yazi.baslik,
    description: yazi.ozet,
    openGraph: paylasim({
      baslik: yazi.baslik,
      aciklama: yazi.ozet,
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
