import { getPayload } from 'payload'
import config from '../../src/payload.config.js'

export const testUser = {
  email: 'e2e@fizyo.test',
  password: 'e2e-sifre',
}

/** Panel testleri için geçici bir kullanıcı oluşturur. */
export async function seedTestUser(): Promise<void> {
  const payload = await getPayload({ config })
  await cleanupTestUser()
  await payload.create({ collection: 'users', data: testUser })
}

export async function cleanupTestUser(): Promise<void> {
  const payload = await getPayload({ config })
  await payload.delete({ collection: 'users', where: { email: { equals: testUser.email } } })
}
