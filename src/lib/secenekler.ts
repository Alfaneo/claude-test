export const YAZI_KATEGORILERI = [
  { label: 'Ortopedi', value: 'ortopedi' },
  { label: 'Nörolojik rehabilitasyon', value: 'norolojik' },
  { label: 'Sporcu sağlığı', value: 'sporcu-sagligi' },
  { label: 'Pediatrik fizyoterapi', value: 'pediatrik' },
  { label: 'Genel sağlık', value: 'genel-saglik' },
] as const

export const CALISMA_SEKILLERI = [
  { label: 'Tam zamanlı', value: 'tam-zamanli' },
  { label: 'Yarı zamanlı', value: 'yari-zamanli' },
  { label: 'Serbest', value: 'serbest' },
  { label: 'Staj', value: 'staj' },
] as const

export const ILLER = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya', 'Ankara', 'Antalya',
  'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl',
  'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır',
  'Düzce', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun',
  'Gümüşhane', 'Hakkari', 'Hatay', 'Iğdır', 'Isparta', 'İstanbul', 'İzmir', 'Kahramanmaraş',
  'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri', 'Kilis', 'Kırıkkale', 'Kırklareli',
  'Kırşehir', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla',
  'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun', 'Şanlıurfa',
  'Siirt', 'Sinop', 'Şırnak', 'Sivas', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Uşak', 'Van',
  'Yalova', 'Yozgat', 'Zonguldak',
] as const

export function etiket<T extends readonly { label: string; value: string }[]>(
  liste: T,
  deger: string | null | undefined,
): string {
  return liste.find((s) => s.value === deger)?.label ?? ''
}
