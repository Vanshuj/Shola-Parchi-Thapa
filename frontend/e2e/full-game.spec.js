import { test, expect, chromium } from '@playwright/test';
/**
 * Two browser contexts play a full game end-to-end against a locally running
 * backend (see README for setup). Skipped by default in CI unless
 * E2E_BACKEND_URL is set, since it needs a live server + DB.
 */
test('two players complete a full game via room code', async () => {
    test.skip(!process.env.E2E_BACKEND_URL, 'Requires a live backend; set E2E_BACKEND_URL to enable.');
    const browser = await chromium.launch();
    const hostContext = await browser.newContext();
    const guestContext = await browser.newContext();
    const hostPage = await hostContext.newPage();
    const guestPage = await guestContext.newPage();
    const suffix = Date.now();
    async function signUp(page, username) {
        await page.goto('/signup');
        await page.getByLabel('Username').fill(username);
        await page.getByLabel('Email').fill(`${username}@example.com`);
        await page.getByLabel('Password').fill('password123');
        await page.getByRole('button', { name: /sign up/i }).click();
        await expect(page).toHaveURL(/customize/);
    }
    await signUp(hostPage, `host_${suffix}`);
    await signUp(guestPage, `guest_${suffix}`);
    await hostPage.goto('/dashboard');
    await hostPage.getByRole('button', { name: /create room/i }).click();
    await expect(hostPage).toHaveURL(/lobby\//);
    const roomCode = hostPage.url().split('/lobby/')[1];
    await guestPage.goto('/dashboard');
    await guestPage.getByLabel('Room code').fill(roomCode);
    await guestPage.getByRole('button', { name: /join/i }).click();
    await expect(guestPage).toHaveURL(new RegExp(`lobby/${roomCode}`));
    await hostPage.getByRole('button', { name: /start game/i }).click();
    await expect(hostPage).toHaveURL(/\/game\//);
    await expect(guestPage).toHaveURL(/\/game\//, { timeout: 10000 });
    await browser.close();
});
test('custom labels persist across sessions', async ({ page }) => {
    test.skip(!process.env.E2E_BACKEND_URL, 'Requires a live backend; set E2E_BACKEND_URL to enable.');
    const username = `labels_${Date.now()}`;
    await page.goto('/signup');
    await page.getByLabel('Username').fill(username);
    await page.getByLabel('Email').fill(`${username}@example.com`);
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: /sign up/i }).click();
    await expect(page).toHaveURL(/customize/);
    await page.getByLabelText('Label for TYPE_1').fill('Nani');
    await page.getByRole('button', { name: /save parchis/i }).click();
    await expect(page.getByText('Parchis saved!')).toBeVisible();
    await page.reload();
    await expect(page.getByLabelText('Label for TYPE_1')).toHaveValue('Nani');
});
test('nostalgia toggles change DOM classes', async ({ page }) => {
    test.skip(!process.env.E2E_BACKEND_URL, 'Requires a live backend; set E2E_BACKEND_URL to enable.');
    await page.goto('/settings');
    const reduceMotionToggle = page.getByRole('checkbox').last();
    await reduceMotionToggle.check();
    await expect(page.locator('html')).not.toHaveClass(/animate-/);
});
