import config from '@payload-config'
import { getPayload } from 'payload'
import sharp from 'sharp'

import { ornekIlanlar, ornekYazilar } from './veriler'

const GUN = 24 * 60 * 60 * 1000

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@fizyo.test'
const ADMIN_SIFRE = process.env.SEED_ADMIN_PASSWORD || 'fizyo1234'

function kapakSvg(baslik: string, [koyu, acik]: readonly [string, string]): string {
  const kelimeler = baslik.split(' ')
  const satirlar: string[] = []
  for (const k of kelimeler) {
    const son = satirlar.at(-1)
    if (son && (son + ' ' + k).length <= 24) satirlar[satirlar.length - 1] = son + ' ' + k
    else satirlar.push(k)
  }
  const kacis = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  const metin = satirlar
    .map((s, i) => `<tspan x="160" dy="${i === 0 ? 0 : 72}">${kacis(s)}</tspan>`)
    .join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="800">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${koyu}"/><stop offset="1" stop-color="${acik}"/>
    </linearGradient></defs>
    <rect width="1400" height="800" fill="url(#g)"/>
    <circle cx="1180" cy="170" r="260" fill="#ffffff" opacity="0.12"/>
    <circle cx="1260" cy="690" r="170" fill="#ffffff" opacity="0.10"/>
    <text x="160" y="${400 - (satirlar.length - 1) * 36}" font-family="DejaVu Sans, Arial, sans-serif"
      font-size="60" font-weight="700" fill="#ffffff">${metin}</text>
  </svg>`
}

async function seed() {
  const payload = await getPayload({ config })
  const simdi = Date.now()

  payload.logger.info('Eski örnek içerik temizleniyor...')
  await payload.delete({ collection: 'ilanlar', where: { id: { exists: true } } })
  await payload.delete({ collection: 'yazilar', where: { id: { exists: true } } })
  await payload.delete({ collection: 'media', where: { id: { exists: true } } })

  const mevcutAdmin = await payload.find({
    collection: 'users',
    where: { email: { equals: ADMIN_EMAIL } },
    limit: 1,
  })
  if (mevcutAdmin.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: { email: ADMIN_EMAIL, password: ADMIN_SIFRE, ad: 'Site Yöneticisi' },
    })
    payload.logger.info(`Yönetici oluşturuldu: ${ADMIN_EMAIL}`)
  }

  for (const y of ornekYazilar) {
    const png = await sharp(Buffer.from(kapakSvg(y.baslik, y.renk))).png().toBuffer()
    const gorsel = await payload.create({
      collection: 'media',
      data: { alt: y.baslik },
      file: { data: png, mimetype: 'image/png', name: `${y.kategori}-${y.gunOnce}.png`, size: png.length },
    })
    await payload.create({
      collection: 'yazilar',
      data: {
        baslik: y.baslik,
        ozet: y.ozet,
        kategori: y.kategori,
        yazar: y.yazar,
        kapakGorseli: gorsel.id,
        icerik: y.icerik as never,
        yayinTarihi: new Date(simdi - y.gunOnce * GUN).toISOString(),
        _status: 'published',
      },
    })
  }
  payload.logger.info(`${ornekYazilar.length} yazı eklendi.`)

  for (const i of ornekIlanlar) {
    await payload.create({
      collection: 'ilanlar',
      data: {
        baslik: i.baslik,
        kurum: i.kurum,
        sehir: i.sehir,
        ilce: i.ilce,
        calismaSekli: i.calismaSekli,
        iletisim: i.iletisim,
        aciklama: i.aciklama as never,
        bitisTarihi: new Date(simdi + i.bitisGun * GUN).toISOString(),
        _status: 'published',
      },
    })
  }
  const dolan = ornekIlanlar.filter((i) => i.bitisGun < 0).length
  payload.logger.info(`${ornekIlanlar.length} ilan eklendi (${dolan} tanesinin süresi dolmuş).`)
}

await seed()
process.exit(0)
