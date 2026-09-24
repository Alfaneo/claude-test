import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Kullanıcı', plural: 'Kullanıcılar' },
  admin: {
    useAsTitle: 'ad',
    defaultColumns: ['ad', 'email'],
  },
  auth: true,
  fields: [
    {
      name: 'ad',
      label: 'Ad soyad',
      type: 'text',
    },
  ],
}
