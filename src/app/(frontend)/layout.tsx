import type { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'

import { paylasim, SITE, siteAdresi } from '@/lib/site'
import './styles.css'

// İçerik panelden değiştiği ve ilanların süresi dolduğu an sitede görünsün diye sayfalar her istekte üretilir.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  metadataBase: new URL(siteAdresi()),
  title: { default: `${SITE.ad} · ${SITE.slogan}`, template: `%s · ${SITE.ad}` },
  description: SITE.aciklama,
  openGraph: paylasim({ baslik: SITE.slogan, aciklama: SITE.aciklama, yol: '/' }),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <header className="ust">
          <div className="kap ust-ic">
            <Link href="/" className="logo">
              <span className="logo-isaret" aria-hidden>
                +
              </span>
              {SITE.ad}
            </Link>
            <nav className="menu" aria-label="Ana menü">
              <Link href="/yazilar">Yazılar</Link>
              <Link href="/ilanlar">İlanlar</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="alt">
          <div className="kap">
            <p>
              © {new Date().getFullYear()} {SITE.ad}. Sitedeki yazılar bilgilendirme amaçlıdır; tanı ve
              tedavi için bir sağlık profesyoneline başvurun.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
