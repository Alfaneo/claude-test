import config from '@/payload.config'
import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { zenginMetin } from '@/lib/lexical'

const GUN = 24 * 60 * 60 * 1000
let payload: Payload

const ilanVerisi = (baslik: string, bitisGun: number) => ({
  baslik,
  kurum: 'Test Kliniği',
  sehir: 'istanbul' as const,
  calismaSekli: 'tam-zamanli' as const,
  aciklama: zenginMetin([{ p: 'Test ilanı' }]) as never,
  iletisim: { eposta: 'test@example.com' },
  bitisTarihi: new Date(Date.now() + bitisGun * GUN).toISOString(),
  _status: 'published' as const,
})

const temizle = () => payload.delete({ collection: 'ilanlar', where: { kurum: { equals: 'Test Kliniği' } } })

describe('İlanlar', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    await temizle()
  })

  afterAll(async () => {
    await temizle()
  })

  it('başlıktan sayfa adresi üretir ve durumu bitiş tarihine göre belirler', async () => {
    const aktif = await payload.create({ collection: 'ilanlar', data: ilanVerisi('Aktif İlan Örneği', 10) })
    const dolmus = await payload.create({ collection: 'ilanlar', data: ilanVerisi('Dolmuş İlan Örneği', -1) })
    expect(aktif.slug).toBe('aktif-ilan-ornegi')
    expect(aktif.durum).toBe('aktif')
    expect(dolmus.durum).toBe('suresi-doldu')
  })

  it('ziyaretçiler süresi dolan ve taslak ilanları göremez', async () => {
    await payload.create({ collection: 'ilanlar', data: { ...ilanVerisi('Taslak İlan', 10), _status: 'draft' } })
    const ziyaretci = await payload.find({
      collection: 'ilanlar',
      where: { kurum: { equals: 'Test Kliniği' } },
      overrideAccess: false,
    })
    expect(ziyaretci.docs.map((d) => d.baslik)).toEqual(['Aktif İlan Örneği'])
  })

  it('bitiş tarihi ileri alınınca ilan tekrar aktif olur', async () => {
    const { docs } = await payload.find({ collection: 'ilanlar', where: { slug: { equals: 'dolmus-ilan-ornegi' } } })
    const guncel = await payload.update({
      collection: 'ilanlar',
      id: docs[0].id,
      data: { bitisTarihi: new Date(Date.now() + 5 * GUN).toISOString() },
    })
    expect(guncel.durum).toBe('aktif')
  })

  it('zamanlanmış görev süresi dolan aktif ilanları kapatır', async () => {
    const ilan = await payload.create({ collection: 'ilanlar', data: ilanVerisi('Bugün Biten İlan', 1) })
    // Süre, ilan oluşturulduktan sonra dolmuş gibi: veritabanında doğrudan geçmişe çek.
    await payload.db.updateOne({
      collection: 'ilanlar',
      id: ilan.id,
      data: { bitisTarihi: new Date(Date.now() - GUN).toISOString() },
    })

    const endpoint = payload.collections.ilanlar.config.endpoints
    const kapat = Array.isArray(endpoint) ? endpoint.find((e) => e.path === '/suresi-dolanlari-kapat') : undefined
    process.env.CRON_SECRET = 'test-sirri'
    const istek = (auth?: string) =>
      kapat!.handler({
        payload,
        user: null,
        headers: new Headers(auth ? { authorization: auth } : {}),
      } as never)

    expect((await istek()).status).toBe(401)
    expect((await istek('Bearer yanlis')).status).toBe(401)
    const yanit = await istek('Bearer test-sirri')
    expect(yanit.status).toBe(200)
    expect((await yanit.json()).kapatilan).toBeGreaterThanOrEqual(1)

    const sonra = await payload.findByID({ collection: 'ilanlar', id: ilan.id })
    expect(sonra.durum).toBe('suresi-doldu')
  })
})
