import { describe, expect, it } from 'vitest'

import { ilanDurumu, kalanGun, varsayilanBitisTarihi } from '@/lib/ilanSuresi'
import { slugify } from '@/lib/slugify'

describe('slugify', () => {
  it('Türkçe karakterleri sadeleştirir', () => {
    expect(slugify('Çocuklarda Duruş Bozuklukları: İlk Adım')).toBe('cocuklarda-durus-bozukluklari-ilk-adim')
    expect(slugify('Şanlıurfa')).toBe('sanliurfa')
    expect(slugify('  Iğdır / Ağrı  ')).toBe('igdir-agri')
  })
})

describe('ilan süresi', () => {
  const simdi = new Date('2026-09-24T12:00:00Z')

  it('varsayılan bitiş tarihi 30 gün sonrasıdır', () => {
    expect(varsayilanBitisTarihi(simdi)).toBe('2026-10-24T12:00:00.000Z')
  })

  it('bitiş tarihi geçen ilanın süresi dolmuştur', () => {
    expect(ilanDurumu('2026-09-25T00:00:00Z', simdi)).toBe('aktif')
    expect(ilanDurumu('2026-09-24T12:00:00Z', simdi)).toBe('suresi-doldu')
    expect(ilanDurumu('2026-09-01T00:00:00Z', simdi)).toBe('suresi-doldu')
  })

  it('kalan günü yukarı yuvarlar, negatife düşmez', () => {
    expect(kalanGun('2026-09-25T00:00:00Z', simdi)).toBe(1)
    expect(kalanGun('2026-10-04T12:00:00Z', simdi)).toBe(10)
    expect(kalanGun('2026-09-01T00:00:00Z', simdi)).toBe(0)
  })
})
