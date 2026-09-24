import type { Field } from 'payload'

/** İsteğe bağlı SEO alanları. Boş bırakılırsa başlık ve özet/açıklama kullanılır. */
export const seoAlanlari: Field = {
  name: 'seo',
  label: 'SEO (isteğe bağlı)',
  type: 'group',
  admin: {
    position: 'sidebar',
    description: 'Google sonuçlarında görünen başlık ve açıklama. Boş bırakırsanız otomatik doldurulur.',
  },
  fields: [
    {
      name: 'baslik',
      label: 'SEO başlığı',
      type: 'text',
      maxLength: 70,
      admin: { description: 'En fazla 60-70 karakter.' },
    },
    {
      name: 'aciklama',
      label: 'SEO açıklaması',
      type: 'textarea',
      maxLength: 170,
      admin: { description: 'En fazla 150-160 karakter.' },
    },
  ],
}
