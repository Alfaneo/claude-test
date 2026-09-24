import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Görsel', plural: 'Medya' },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      label: 'Görsel açıklaması',
      type: 'text',
      required: true,
      admin: {
        description: 'Görme engelli ziyaretçiler ve arama motorları için kısa bir açıklama.',
      },
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'kart', width: 640, height: 400, position: 'centre' },
      { name: 'genis', width: 1400 },
      // WhatsApp ve sosyal medya önizlemesi: 1200x630, küçük dosya boyutu için JPEG.
      {
        name: 'paylasim',
        width: 1200,
        height: 630,
        position: 'centre',
        formatOptions: { format: 'jpeg', options: { quality: 80 } },
      },
    ],
  },
}
