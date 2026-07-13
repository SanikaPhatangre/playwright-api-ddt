import { test, expect, request } from '@playwright/test';
import fs from 'fs';

test('Authenticated API Request', async () => {
  // 1. Read the token saved in global-setup
  const auth = JSON.parse(fs.readFileSync('auth-token.json', 'utf-8'));
  
  const apiContext = await request.newContext({
    extraHTTPHeaders: {
      'Authorization': `Bearer ${auth.token}`, // Injecting the token
    },
  });

  // 2. Make the protected request
  const response = await apiContext.get('https://api.your-app.com/dashboard');
  expect(response.status()).toBe(200);
});