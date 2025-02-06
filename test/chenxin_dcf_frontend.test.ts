import 'dotenv/config';
import puppeteer, { Browser, Page } from 'puppeteer';
import supertest from 'supertest';
import { db } from '../util/db';
import { usersTable } from '../schema/db';
import { eq } from 'drizzle-orm';

function wait(milliseconds: number) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

describe('Profile Page Tests', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    // First check if the server is running
    try {
      const response = await fetch('http://localhost:3000');
      if (!response.ok) {
        throw new Error('Server is not responding properly');
      }
    } catch (error) {
      console.error('Please ensure the frontend server is running on http://localhost:3000');
      process.exit(1);
    }

    browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
      executablePath: process.env.BROWSER_PATH,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ],
      ignoreDefaultArgs: ['--enable-automation'],
      slowMo: 100
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  }, 50 * 1000);

  test('should navigate to the profile page and edit the profile', async () => {
    const profileUrl = 'http://localhost:3000/#profile';

    const dummyUser = { email: `dummyuser@gmail.com`, password: "dummyPassword", username: "dummy" }

    // Create a dummy account
    const registerResponse = await supertest("http://localhost:3000")
      .post('/auth/register')
      .send(dummyUser);
    console.log('Register response:', registerResponse.body);

    // Login to get the access token
    const loginResponse = await supertest("http://localhost:3000")
      .post("/auth/login")
      .send({ email: dummyUser.email, password: dummyUser.password });
    console.log('Login response:', loginResponse.body);

    const token = loginResponse.body.token;

    // Enable request interception
    await page.setRequestInterception(true);
    let updateSuccess = false;

    page.on('request', request => {
      request.continue();
    });

    page.on('response', async response => {
      if (response.url().includes('/profile') && response.request().method() === 'PUT') {
        const status = response.status();
        updateSuccess = status === 200;
        console.log('Profile update status:', status);
      }
    });

    // Set token before navigation
    await page.evaluateOnNewDocument((token) => {
      localStorage.setItem('authToken', token);
    }, token);

    await page.goto(profileUrl);

    try {
      await page.waitForSelector('#view-profile', { timeout: 5000 });
      console.log('Profile view loaded successfully');
    } catch (error) {
      console.error('Profile view did not load. Check if the page is properly rendering.');
      throw error;
    }

    // Click the edit button to enable profile editing
    await page.click('#view-profile button');
    console.log('Clicked edit button');

    page.on('dialog', async dialog => {
      await dialog.accept();
    });

    // Wait for input fields
    await page.waitForSelector('#edit-username');
    await page.waitForSelector('#edit-email');
    console.log('Edit fields loaded');

    // Clear input fields before typing
    await page.$eval('#edit-username', el => (el as HTMLInputElement).value = '');
    await page.$eval('#edit-email', el => (el as HTMLInputElement).value = '');

    // Type new values
    await page.type('#edit-username', 'updateduser', { delay: 10 });
    await page.type('#edit-email', 'updateduser@example.com', { delay: 10 });
    console.log('Filled in new values');

    // Click save and wait for update
    await page.click('#view-profile button');
    console.log('Clicked save button');

    // Wait for edit mode to be disabled
    await page.waitForFunction(
      () => !document.querySelector('#edit-username'),
      { timeout: 5000 }
    );

    // Wait for profile to update
    await page.waitForFunction(
      () => document.querySelector('#profile-username')?.textContent === 'updateduser',
      { timeout: 5000 }
    );

    // Verify update success
    expect(updateSuccess).toBe(true);

    // Add debug logging
    const debugUsername = await page.$eval('#profile-username', el => {
      console.log('Username element:', el);
      console.log('Username text content:', el.textContent);
      return el.textContent;
    });
    console.log('Debug username:', debugUsername);

    // Verify API
    const verifyResponse = await supertest("http://localhost:3000")
      .get("/profile")
      .set('Authorization', `Bearer ${token}`);
    console.log('Profile verification response:', verifyResponse.body);

    // Verify updates
    const updatedUsername = await page.$eval('#profile-username', el => el.textContent);
    const updatedEmail = await page.$eval('#profile-email', el => el.textContent);

    expect(updatedUsername).toBe('updateduser');
    expect(updatedEmail).toBe('updateduser@example.com');

    await db.delete(usersTable).where(eq(usersTable.email, dummyUser.email));
  }, 50 * 1000);
});