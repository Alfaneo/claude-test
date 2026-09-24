import type { MetadataRoute } from 'next'

import { siteAdresi } from '@/lib/site'
import { payloadAl } from '@/lib/veri'

// Yeni yazı/ilan eklendiğinde ve ilan süresi dolduğunda harita güncel olsun diye her istekte üretilir.
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const adres = siteAdresi()
  const payload = await payloadAl()
  const ortak = { limit: 5000, depth: 0, overrideAccess: false, pagination: false } as const

  const [yazilar, ilanlar] = await Promise.all([
    payload.find({ collection: 'yazilar', ...ortak, select: { slug: true, updatedAt: true } }),
    payload.find({ collection: 'ilanlar', ...ortak, select: { slug: true, updatedAt: true } }),
  ])

  return [
    { url: adres, changeFrequency: 'daily', priority: 1 },
    { url: `${adres}/ilanlar`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${adres}/yazilar`, changeFrequency: 'weekly', priority: 0.8 },
    ...ilanlar.docs.map((i) => ({
      url: `${adres}/ilanlar/${i.slug}`,
      lastModified: i.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...yazilar.docs.map((y) => ({
      url: `${adres}/yazilar/${y.slug}`,
      lastModified: y.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
