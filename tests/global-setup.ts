import { request, expect } from '@playwright/test';
import fs from 'fs';

async function globalSetup() {
  const context = await request.newContext();
  
  // 1. Perform Login
  const response = await context.post('https://api.your-app.com/login', {
    data: { username: 'test-user', password: 'password123' }
  });
  
  expect(response.status()).toBe(200);
  const { token } = await response.json();
  
  // 2. Save token to a local JSON file
  fs.writeFileSync('auth-token.json', JSON.stringify({ token }));
}

export default globalSetup;
