import { expect, test } from '@playwright/test'

const B = 'http://localhost:3000'

test.describe('Site', () => {
  test('ana sayfa ilanları ve yazıları gösterir', async ({ page }) => {
    await page.goto(B)
    await expect(page).toHaveTitle(/Fizyo Rehber/)
    await expect(page.getByRole('heading', { name: 'Güncel ilanlar' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Son yazılar' })).toBeVisible()
  })

  test('ilanlar sayfası şehre göre filtreler', async ({ page }) => {
    await page.goto(`${B}/ilanlar`)
    await page.selectOption('select[name="sehir"]', 'istanbul')
    await page.getByRole('button', { name: 'Filtrele' }).click()
    await expect(page).toHaveURL(/sehir=istanbul/)
    for (const kart of await page.locator('.ilan-karti .meta').allTextContents()) {
      expect(kart).toContain('İstanbul')
    }
  })

  test('olmayan ya da süresi dolan ilan 404 verir', async ({ page }) => {
    const yanit = await page.goto(`${B}/ilanlar/boyle-bir-ilan-yok`)
    expect(yanit?.status()).toBe(404)
    await expect(page.getByRole('heading', { name: 'Sayfa bulunamadı' })).toBeVisible()
  })
})
