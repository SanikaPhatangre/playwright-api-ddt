import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

interface TestUser {
  name: string;
  job: string;
}

const records: TestUser[] = parse(fs.readFileSync(path.join(__dirname, '../test_users.csv'), 'utf-8'), {
  columns: true,
  skip_empty_lines: true,
  trim: true
});

for (const record of records) {
  if (!record.name) continue;

  test(`Create New User: ${record.name}`, async ({ request }) => {
    // JSONPlaceholder uses /users for creation
// It will look for the BASE_URL from the environment, defaulting to the live site if nothing is set
const response = await request.post(`${process.env.BASE_URL || 'https://jsonplaceholder.typicode.com'}/users`, {
      data: {
        name: record.name,
        job: record.job
      }
    });

    // JSONPlaceholder returns 201 for successful creation
    expect(response.status()).toBe(201);
    
    const body = await response.json();
    expect(body.name).toBe(record.name);
  });
}