import config from '@payload-config'
import { getPayload, type Where } from 'payload'

import type { Ilanlar, Media, Yazilar } from '@/payload-types'

export const payloadAl = () => getPayload({ config })

// overrideAccess: false → koleksiyonlardaki ziyaretçi kuralları (yayında olma, bitiş tarihi) uygulanır.

export async function yazilariGetir({ kategori, limit = 12 }: { kategori?: string; limit?: number } = {}) {
  const payload = await payloadAl()
  const where: Where = kategori ? { kategori: { equals: kategori } } : {}
  const sonuc = await payload.find({
    collection: 'yazilar',
    where,
    sort: '-yayinTarihi',
    limit,
    depth: 1,
    overrideAccess: false,
  })
  return sonuc.docs
}

export async function yaziGetir(slug: string): Promise<Yazilar | null> {
  const payload = await payloadAl()
  const sonuc = await payload.find({
    collection: 'yazilar',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
    overrideAccess: false,
  })
  return sonuc.docs[0] ?? null
}

export async function ilanlariGetir({
  sehir,
  calismaSekli,
  limit = 50,
}: { sehir?: string; calismaSekli?: string; limit?: number } = {}) {
  const payload = await payloadAl()
  const kosullar: Where[] = []
  if (sehir) kosullar.push({ sehir: { equals: sehir } })
  if (calismaSekli) kosullar.push({ calismaSekli: { equals: calismaSekli } })
  const sonuc = await payload.find({
    collection: 'ilanlar',
    where: kosullar.length ? { and: kosullar } : {},
    sort: '-createdAt',
    limit,
    overrideAccess: false,
  })
  return sonuc.docs
}

export async function ilanGetir(slug: string): Promise<Ilanlar | null> {
  const payload = await payloadAl()
  const sonuc = await payload.find({
    collection: 'ilanlar',
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: false,
  })
  return sonuc.docs[0] ?? null
}

export function gorsel(m: Yazilar['kapakGorseli'], boyut?: 'kart' | 'genis') {
  if (!m || typeof m !== 'object') return null
  const medya = m as Media
  const url = (boyut && medya.sizes?.[boyut]?.url) || medya.url
  return url ? { url, alt: medya.alt } : null
}

export const tarihYaz = (t?: string | null) =>
  t ? new Date(t).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''
