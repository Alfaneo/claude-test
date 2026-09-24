import type { CollectionConfig } from 'payload'

import { slugField } from '@/fields/slug'
import { YAZI_KATEGORILERI } from '@/lib/secenekler'

export const Yazilar: CollectionConfig = {
  slug: 'yazilar',
  labels: { singular: 'Yazı', plural: 'Yazılar' },
  admin: {
    useAsTitle: 'baslik',
    defaultColumns: ['baslik', 'kategori', 'yayinTarihi', '_status'],
    preview: (doc) => (doc?.slug ? `/yazilar/${doc.slug}` : null),
  },
  versions: {
    drafts: true,
  },
  access: {
    read: ({ req }) => (req.user ? true : { _status: { equals: 'published' } }),
  },
  defaultSort: '-yayinTarihi',
  fields: [
    {
      name: 'baslik',
      label: 'Başlık',
      type: 'text',
      required: true,
    },
    {
      name: 'ozet',
      label: 'Kısa özet',
      type: 'textarea',
      required: true,
      maxLength: 300,
      admin: { description: 'Yazı listesinde ve arama sonuçlarında görünen 1-2 cümle.' },
    },
    {
      name: 'kapakGorseli',
      label: 'Kapak görseli',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'icerik',
      label: 'İçerik',
      type: 'richText',
      required: true,
    },
    slugField(),
    {
      name: 'kategori',
      label: 'Kategori',
      type: 'select',
      required: true,
      options: [...YAZI_KATEGORILERI],
      admin: { position: 'sidebar' },
    },
    {
      name: 'yazar',
      label: 'Yazar',
      type: 'text',
      admin: { position: 'sidebar' },
    },
    {
      name: 'yayinTarihi',
      label: 'Yayın tarihi',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly', displayFormat: 'd MMMM yyyy' },
      },
      hooks: {
        beforeChange: [
          ({ value, siblingData }) =>
            value ?? (siblingData._status === 'published' ? new Date().toISOString() : value),
        ],
      },
    },
  ],
}
