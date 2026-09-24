import { ImageResponse } from 'next/og'

import { SITE } from '@/lib/site'

const BOYUT = { width: 1200, height: 630 }

const kisalt = (s: string | null, max: number) => {
  const t = (s ?? '').trim()
  return t.length > max ? t.slice(0, max - 1).trimEnd() + '…' : t
}

/** Paylaşım önizlemesi (WhatsApp, sosyal medya) için başlıklı kart görseli üretir. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const baslik = kisalt(searchParams.get('baslik'), 110) || SITE.slogan
  const ust = kisalt(searchParams.get('ust'), 60)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
          color: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 36, fontWeight: 700 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 64,
              height: 64,
              borderRadius: 16,
              background: '#ffffff',
              color: '#0f766e',
              fontSize: 48,
            }}
          >
            +
          </div>
          {SITE.ad}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {ust && <div style={{ display: 'flex', fontSize: 34, opacity: 0.85 }}>{ust}</div>}
          <div style={{ display: 'flex', fontSize: baslik.length > 60 ? 58 : 72, fontWeight: 700, lineHeight: 1.15 }}>
            {baslik}
          </div>
        </div>
      </div>
    ),
    {
      ...BOYUT,
      headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=86400' },
    },
  )
}
