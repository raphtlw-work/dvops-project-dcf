import puppeteer, { Browser, Page } from "puppeteer"

describe("Coin Decider Frontend Tests", () => {
  let browser: Browser
  let page: Page

  beforeAll(async () => {
    // Launch Puppeteer browser
    browser = await puppeteer.launch({
      headless: false, // Set to false to view browser actions
      defaultViewport: null,
    })
    page = await browser.newPage()
  })

  afterAll(async () => {
    // Close the browser after tests
    await browser.close()
  })

  test("should load the Coin Decider homepage", async () => {
    const filePath = "http://localhost:3000"
    await page.goto(filePath)

    const title = await page.title()
    expect(title).toBe("Coin Decider")
  })

  test('should display the "Get started" button', async () => {
    await page.evaluate(() => {
      localStorage.removeItem('authToken')
    })

    await page.reload();

    await new Promise((done) => setTimeout(done, 500))

    const buttonText = await page.$eval(".get-started-btn", (btn) =>
      btn.textContent?.trim(),
    )
    expect(buttonText).toBe("Get started")
  })

  test('should navigate to login view when "Get started" is clicked', async () => {
    const filePath = "http://localhost:3000"
    await page.goto(filePath)

    await page.evaluate(() => {
      localStorage.removeItem('authToken')
    })

    await page.reload();

    await new Promise((done) => setTimeout(done, 500))

    await page.click(".get-started-btn")

    const isLoginViewVisible = await page.$eval("#view-login", (el) => {
      return !el.classList.contains("hidden")
    })
    expect(isLoginViewVisible).toBe(true)
  })

  test('should show current balance as "Loading" on balance navigation', async () => {
    const balanceText = await page.$eval("#user-balance", (el) =>
      el.textContent?.trim(),
    )
    expect(balanceText).toBe("Loading")
  })
})
