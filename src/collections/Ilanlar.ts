import type { CollectionConfig, Where } from 'payload'

import { seoAlanlari } from '@/fields/seo'
import { slugField } from '@/fields/slug'
import { ilanDurumu, varsayilanBitisTarihi, VARSAYILAN_ILAN_SURESI_GUN } from '@/lib/ilanSuresi'
import { CALISMA_SEKILLERI, ILLER } from '@/lib/secenekler'
import { slugify } from '@/lib/slugify'

/** Ziyaretçilerin görebileceği ilanlar: yayınlanmış ve bitiş tarihi geçmemiş. */
export const yayindakiIlanlar = (simdi: Date = new Date()): Where => ({
  and: [
    { _status: { equals: 'published' } },
    { bitisTarihi: { greater_than: simdi.toISOString() } },
  ],
})

export const Ilanlar: CollectionConfig = {
  slug: 'ilanlar',
  labels: { singular: 'İlan', plural: 'İlanlar' },
  admin: {
    useAsTitle: 'baslik',
    defaultColumns: ['baslik', 'kurum', 'sehir', 'bitisTarihi', 'durum', '_status'],
    listSearchableFields: ['baslik', 'kurum'],
    preview: (doc) => (doc?.slug ? `/ilanlar/${doc.slug}` : null),
  },
  versions: {
    drafts: true,
  },
  access: {
    // Süresi dolan ilan sitede görünmez, ama panelde kalır ve tekrar yayına alınabilir.
    read: ({ req }) => (req.user ? true : yayindakiIlanlar()),
  },
  defaultSort: 'bitisTarihi',
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        const bitis = data.bitisTarihi ?? originalDoc?.bitisTarihi
        if (bitis) data.durum = ilanDurumu(bitis)
        return data
      },
    ],
  },
  endpoints: [
    {
      // Vercel Cron her gün çağırır; süresi dolan ilanları panelde "Süresi doldu" olarak işaretler.
      path: '/suresi-dolanlari-kapat',
      method: 'get',
      handler: async (req) => {
        const cronSecret = process.env.CRON_SECRET
        const yetkili =
          Boolean(req.user) ||
          (Boolean(cronSecret) && req.headers.get('authorization') === `Bearer ${cronSecret}`)
        if (!yetkili) return Response.json({ hata: 'Yetkisiz' }, { status: 401 })

        const sonuc = await req.payload.update({
          collection: 'ilanlar',
          where: {
            and: [
              { durum: { equals: 'aktif' } },
              { bitisTarihi: { less_than_equal: new Date().toISOString() } },
            ],
          },
          data: { durum: 'suresi-doldu' },
          overrideAccess: true,
          req,
        })

        return Response.json({ kapatilan: sonuc.docs.length, hatalar: sonuc.errors.length })
      },
    },
  ],
  fields: [
    {
      name: 'baslik',
      label: 'İlan başlığı',
      type: 'text',
      required: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'kurum',
          label: 'Kurum',
          type: 'text',
          required: true,
        },
        {
          name: 'calismaSekli',
          label: 'Çalışma şekli',
          type: 'select',
          required: true,
          options: [...CALISMA_SEKILLERI],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'sehir',
          label: 'Şehir',
          type: 'select',
          required: true,
          options: ILLER.map((il) => ({ label: il, value: slugify(il) })),
        },
        {
          name: 'ilce',
          label: 'İlçe',
          type: 'text',
        },
      ],
    },
    {
      name: 'aciklama',
      label: 'Açıklama',
      type: 'richText',
      required: true,
      admin: { description: 'Aranan nitelikler, görevler, çalışma koşulları.' },
    },
    {
      name: 'iletisim',
      label: 'İletişim',
      type: 'group',
      admin: { description: 'En az bir iletişim yolu girin.' },
      validate: (value) => {
        const v = value as { telefon?: string; eposta?: string; basvuruLinki?: string } | undefined
        return v?.telefon || v?.eposta || v?.basvuruLinki
          ? true
          : 'Telefon, e-posta veya başvuru bağlantısından en az biri gerekli.'
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'telefon', label: 'Telefon', type: 'text' },
            { name: 'eposta', label: 'E-posta', type: 'email' },
          ],
        },
        {
          name: 'basvuruLinki',
          label: 'Başvuru bağlantısı',
          type: 'text',
          validate: (value: string | null | undefined) =>
            !value || /^https?:\/\//.test(value) ? true : 'Bağlantı http:// veya https:// ile başlamalı.',
        },
      ],
    },
    slugField(),
    seoAlanlari,
    {
      name: 'bitisTarihi',
      label: 'Bitiş tarihi',
      type: 'date',
      required: true,
      defaultValue: () => varsayilanBitisTarihi(),
      admin: {
        position: 'sidebar',
        description: `Bu tarihte ilan sitede görünmez olur. Varsayılan: ${VARSAYILAN_ILAN_SURESI_GUN} gün sonrası. Tekrar yayına almak için tarihi ileri alın.`,
        date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMMM yyyy' },
      },
    },
    {
      name: 'durum',
      label: 'Süre durumu',
      type: 'select',
      defaultValue: 'aktif',
      index: true,
      options: [
        { label: 'Aktif', value: 'aktif' },
        { label: 'Süresi doldu', value: 'suresi-doldu' },
      ],
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Bitiş tarihine göre otomatik belirlenir.',
      },
    },
  ],
}
