/** Bitiş tarihi girilmeyen ilanlara verilen varsayılan yayın süresi. */
export const VARSAYILAN_ILAN_SURESI_GUN = 30

export type IlanDurumu = 'aktif' | 'suresi-doldu'

export function varsayilanBitisTarihi(simdi: Date = new Date()): string {
  const tarih = new Date(simdi)
  tarih.setDate(tarih.getDate() + VARSAYILAN_ILAN_SURESI_GUN)
  return tarih.toISOString()
}

export function ilanDurumu(bitisTarihi: string | Date, simdi: Date = new Date()): IlanDurumu {
  return new Date(bitisTarihi).getTime() > simdi.getTime() ? 'aktif' : 'suresi-doldu'
}

export function kalanGun(bitisTarihi: string | Date, simdi: Date = new Date()): number {
  const fark = new Date(bitisTarihi).getTime() - simdi.getTime()
  return Math.max(0, Math.ceil(fark / (24 * 60 * 60 * 1000)))
}
