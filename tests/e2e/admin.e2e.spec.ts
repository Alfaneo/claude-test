import { expect, test, type Page } from '@playwright/test'

import { login } from '../helpers/login'
import { cleanupTestUser, seedTestUser, testUser } from '../helpers/seedUser'

const B = 'http://localhost:3000'

test.describe('Yönetim paneli', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    await seedTestUser()
    page = await (await browser.newContext()).newPage()
    await login({ page, user: testUser })
  })

  test.afterAll(async () => {
    await cleanupTestUser()
  })

  test('ilanlar listesi açılır', async () => {
    await page.goto(`${B}/admin/collections/ilanlar`)
    await expect(page.locator('h1', { hasText: 'İlanlar' })).toBeVisible()
  })

  test('yeni ilan formunda bitiş tarihi önceden doludur', async () => {
    await page.goto(`${B}/admin/collections/ilanlar/create`)
    await expect(page.locator('input[name="baslik"]')).toBeVisible()
    await expect(page.locator('#field-bitisTarihi input')).not.toHaveValue('')
  })

  test('yazılar listesi açılır', async () => {
    await page.goto(`${B}/admin/collections/yazilar`)
    await expect(page.locator('h1', { hasText: 'Yazılar' })).toBeVisible()
  })
})
