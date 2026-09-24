import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { tr } from '@payloadcms/translations/languages/tr'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Ilanlar } from './collections/Ilanlar'
import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { Yazilar } from './collections/Yazilar'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    avatar: 'default',
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' · Fizyo Panel',
    },
  },
  i18n: {
    supportedLanguages: { tr },
    fallbackLanguage: 'tr',
  },
  collections: [Yazilar, Ilanlar, Media, Users],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Yerelde bir SQLite dosyası, canlıda Turso (libsql://...) kullanılır.
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || '',
      authToken: process.env.DATABASE_AUTH_TOKEN,
    },
  }),
  sharp,
  plugins: [
    // Vercel'de dosya sistemi kalıcı olmadığından görseller Vercel Blob'a yüklenir.
    // clientUploads: dosya tarayıcıdan doğrudan Blob'a gider; Vercel'in 4,5 MB istek sınırına takılmaz.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      clientUploads: true,
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
