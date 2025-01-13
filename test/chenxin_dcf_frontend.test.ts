import 'dotenv/config';
import puppeteer, { Browser, Page } from 'puppeteer';

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

    // Set token before navigation
    await page.evaluateOnNewDocument(() => {
      localStorage.setItem('authToken', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJlbWFpbCI6InNuYWNrQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoic25hY2siLCJiYWxhbmNlIjoiMC4wMCJ9LCJpYXQiOjE3MzMzMzU4NjMsImV4cCI6MTczMzU5NTA2M30.YOUR_VALID_SIGNATURE");
    });

    await page.goto(profileUrl, { waitUntil: 'networkidle0' });

    try {
      await page.waitForSelector('#view-profile', { timeout: 5000 });
    } catch (error) {
      console.error('Profile view did not load. Check if the page is properly rendering.');
      throw error;
    }

    // Click the edit button to enable profile editing
    await page.click('#view-profile button');

    // Wait for and fill the input fields
    await page.waitForSelector('#edit-username');
    await page.type('#edit-username', 'updateduser', { delay: 100 });
    await page.type('#edit-email', 'updateduser@example.com', { delay: 100 });

    // Click save and wait for update
    await page.click('#view-profile button');

    // Verify updates
    const updatedUsername = await page.$eval('#profile-username', el => el.textContent);
    const updatedEmail = await page.$eval('#profile-email', el => el.textContent);
    
    expect(updatedUsername).toBe('updateduser');
    expect(updatedEmail).toBe('updateduser@example.com');
  }, 50 * 1000);
});