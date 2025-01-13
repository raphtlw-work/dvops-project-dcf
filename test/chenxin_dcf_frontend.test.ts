import 'dotenv/config';
import puppeteer, { Browser, Page } from 'puppeteer';

describe('Profile Page Tests', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    // Launch Puppeteer browser with slowMo optionxx
    browser = await puppeteer.launch({
      headless: true, // Set to false to view browser actions
      defaultViewport: null,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ],
      ignoreDefaultArgs: true,
      slowMo: 100 // Add a 100ms delay between each operation
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    // Close the browser after tests
    await browser.close();
  }, 50 * 1000);

  test('should navigate to the profile page and edit the profile', async () => {
    const profileUrl = 'http://localhost:3000/#profile';

    await page.goto(profileUrl);

    await page.evaluate(() => {
        window.localStorage.setItem('authToken', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJlbWFpbCI6InNuYWNrQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoic25hY2siLCJiYWxhbmNlIjoiMC4wMCIsInBhc3N3b3JkIjoiJDJiJDEwJDFOMzQxdVFabW83UWdBd3BRWlJGOS4xT2drSmU0ZVpGcWUxU0w4OVZ2cU5BMlVUd1FhUElLIn0sImlhdCI6MTczMzMzNTg2MywiZXhwIjoxNzMzNTk1MDYzfQ.rvSOnO_7rwHg0FC3uQ1opwoqB4mKsFfUoI1_M0jEZqE")
    })

    await page.waitForSelector('#view-profile'); // Wait for profile view to load

    // Click the edit button to enable profile editing
    await page.click('#view-profile button');

    // Wait for the input fields to appear and fill them with new values
    await page.waitForSelector('#edit-username');
    await page.$eval('#edit-username', (el) => {
        (el as HTMLInputElement).value = 'updateduser';
    });
    await page.$eval('#edit-email', (el) => {
        (el as HTMLInputElement).value = 'updateduser@example.com';
    });

    // Click the save button to save the updated profile
    await page.click('#view-profile button');

    // Wait for the profile update to complete and check the updated values
    await page.waitForSelector('#profile-username');
    const updatedUsername = await page.$eval('#profile-username', (el) => el.textContent);
    const updatedEmail = await page.$eval('#profile-email', (el) => el.textContent);
    
    expect(updatedUsername).toBe('updateduser');
    expect(updatedEmail).toBe('updateduser@example.com');
  }, 50 * 1000);
});
