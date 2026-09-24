import type { MetadataRoute } from 'next'

import { indekslensin, siteAdresi } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  // Test aşamasında taramaya izin verilir ama her sayfa "noindex" der (bkz. layout.tsx).
  // Burada engellenirse arama motorları noindex etiketini göremez ve adresi yine listeleyebilir.
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin'] },
    ...(indekslensin() ? { sitemap: `${siteAdresi()}/sitemap.xml` } : {}),
  }
}
