import Link from 'next/link'

export default function BulunamadiSayfasi() {
  return (
    <section className="kap dar bolum">
      <h1>Sayfa bulunamadı</h1>
      <p className="soluk">Aradığınız sayfa kaldırılmış veya ilanın süresi dolmuş olabilir.</p>
      <p>
        <Link href="/ilanlar" className="buton">
          Güncel ilanlara dön
        </Link>
      </p>
    </section>
  )
}
