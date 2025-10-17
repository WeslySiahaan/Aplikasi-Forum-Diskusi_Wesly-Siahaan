import { test, expect } from '@playwright/test';

test('login flow succeeds and navigates to home', async ({ page }) => {
  // Ensure a clean unauthenticated state
  await page.addInitScript(() => window.localStorage.clear());

  // Intercept network calls to Dicoding API and mock successful auth
  await page.route('https://forum-api.dicoding.dev/v1/login', async (route) => {
    const body = await route.request().postDataJSON();
    if (!body?.email || !body?.password) {
      return route.fulfill({ status: 400, body: JSON.stringify({ status: 'fail', message: 'Invalid' }) });
    }
    return route.fulfill({ status: 200, body: JSON.stringify({ status: 'success', data: { token: 'test-token' } }) });
  });

  // IMPORTANT: return 401 before login; 200 after Authorization is present
  await page.route('https://forum-api.dicoding.dev/v1/users/me', async (route) => {
    const auth = route.request().headers()['authorization'] || '';
    if (!auth.startsWith('Bearer')) {
      return route.fulfill({
        status: 401,
        body: JSON.stringify({ status: 'fail', message: 'Missing authentication' }),
      });
    }
    return route.fulfill({
      status: 200,
      body: JSON.stringify({
        status: 'success',
        data: { user: { id: 'user-1', name: 'Test User', avatar: 'https://example.com/avatar.png' } },
      }),
    });
  });

  // Mock the initial preload calls (users/threads)
  await page.route('https://forum-api.dicoding.dev/v1/users', async (route) => {
    return route.fulfill({
      status: 200,
      body: JSON.stringify({
        status: 'success',
        data: { users: [{ id: 'user-1', name: 'Test User', avatar: 'a.png' }] },
      }),
    });
  });

  await page.route('https://forum-api.dicoding.dev/v1/threads', async (route) => {
    return route.fulfill({
      status: 200,
      body: JSON.stringify({
        status: 'success',
        data: { threads: [] },
      }),
    });
  });

  await page.goto('/');

  // Login form interaction
  await page.getByPlaceholder('Username').fill('user@example.com');
  await page.getByPlaceholder('Password').fill('password');
  await page.getByRole('button', { name: /login/i }).click();

  // After login, app should show authenticated layout (Navigation + HomePage)
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('button', { name: /sign out/i })).toBeVisible();

  // Ensure localStorage token persisted
  const token = await page.evaluate(() => window.localStorage.getItem('accessToken'));
  expect(token).toBe('test-token');
});