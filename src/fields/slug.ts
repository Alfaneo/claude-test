import type { Field } from 'payload'

import { slugify } from '@/lib/slugify'

/** Boş bırakılırsa başlıktan otomatik üretilen, sayfa adresinde kullanılan alan. */
export const slugField = (kaynakAlan = 'baslik'): Field => ({
  name: 'slug',
  label: 'Sayfa adresi',
  type: 'text',
  index: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: 'Boş bırakırsanız başlıktan otomatik oluşturulur.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.trim()) return slugify(value)
        const kaynak = data?.[kaynakAlan]
        return typeof kaynak === 'string' ? slugify(kaynak) : value
      },
    ],
  },
})
