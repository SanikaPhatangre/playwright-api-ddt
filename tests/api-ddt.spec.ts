import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

interface TestUser { name: string; job: string; }

const records: TestUser[] = parse(fs.readFileSync(path.join(__dirname, '../test_users.csv'), 'utf-8'), {
  columns: true, skip_empty_lines: true, trim: true
});

for (const record of records) {
  test(`Lifecycle Test: ${record.name}`, async ({ request }) => {
    // 1. CREATE
    const response = await request.post(`${process.env.BASE_URL || 'https://jsonplaceholder.typicode.com'}/users`, {
      data: { name: record.name, job: record.job }
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    const userId = body.id;

    // 2. ASSERT
    expect(body.name).toBe(record.name);

    // 3. CLEANUP (Teardown)
    // We send a DELETE request to ensure no "junk" data is left behind
    const deleteResponse = await request.delete(`${process.env.BASE_URL || 'https://jsonplaceholder.typicode.com'}/users/${userId}`);
    
    // Note: JSONPlaceholder returns 200/204 for successful deletes
    expect(deleteResponse.ok()).toBeTruthy();
  });
}

// --- Negative Testing Section ---
const invalidRecords = parse(fs.readFileSync(path.join(__dirname, '../invalid_users.csv'), 'utf-8'), {
  columns: true, skip_empty_lines: true, trim: true
});

for (const record of invalidRecords) {
  test(`Negative Test: Expect Error for ${record.job}`, async ({ request }) => {
    const response = await request.post(`${process.env.BASE_URL || 'https://jsonplaceholder.typicode.com'}/users`, {
      data: { name: record.name, job: record.job }
    });

    // We expect the API to reject the request (400) or fail to find the endpoint (404)
    // Depending on your API, it might be 400, 422, or 404.
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });
}