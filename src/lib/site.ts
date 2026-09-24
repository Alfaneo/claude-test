export const SITE = {
  ad: 'Fizyo Rehber',
  slogan: 'Fizyoterapi yazıları ve güncel iş ilanları',
  aciklama:
    'Fizyoterapistlerin yazdığı bilgilendirici içerikler ve Türkiye genelinde güncel fizyoterapist ilanları.',
}

/**
 * Sitenin tam adresi. WhatsApp gibi uygulamalar önizleme görselini tam adresle ister.
 * Vercel canlı adresi otomatik verir; kendi alan adınızı bağlayınca NEXT_PUBLIC_SITE_URL ile değiştirilebilir.
 */
export function siteAdresi(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  return 'http://localhost:3000'
}

/** Paylaşım önizlemesi için sitenin renklerinde, başlıklı bir kart görselinin adresi (bkz. app/(frontend)/og). */
export function kartGorseli(baslik: string, ust?: string): string {
  const q = new URLSearchParams({ baslik })
  if (ust) q.set('ust', ust)
  return `/og?${q}`
}

type PaylasimGorseli = { url: string; width?: number; height?: number; alt?: string }

/** Sayfanın WhatsApp/sosyal medya önizlemesi. Alt sayfalar openGraph'ı tamamen değiştirdiği için ortak alanlar burada. */
export function paylasim({
  baslik,
  aciklama,
  yol,
  gorsel,
  ust,
  tur = 'website',
}: {
  baslik: string
  aciklama: string
  yol: string
  gorsel?: PaylasimGorseli | null
  ust?: string
  tur?: 'website' | 'article'
}) {
  return {
    title: baslik,
    description: aciklama,
    url: yol,
    siteName: SITE.ad,
    locale: 'tr_TR',
    type: tur,
    images: [gorsel ?? { url: kartGorseli(baslik, ust), width: 1200, height: 630, alt: baslik }],
  }
}

/**
 * Site arama motorlarında görünsün mü? Test aşamasında kapalı (noindex).
 * Yayına alırken Vercel'de SITE_INDEKSLENSIN=true ortam değişkenini ekleyip yeniden deploy edin.
 */
export const indekslensin = () => process.env.SITE_INDEKSLENSIN === 'true'
