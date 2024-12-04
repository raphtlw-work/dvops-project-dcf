import puppeteer, { Browser, Page } from "puppeteer"

describe("Coin Decider Frontend Tests", () => {
  let browser: Browser
  let page: Page

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      slowMo: 200,
    })
    page = await browser.newPage()
  })

  afterAll(async () => {
    await browser.close()
  })

  test("should load the credit machine page", async () => {
    const filePath = "http://localhost:3000/#creditmachine"
    await page.goto(filePath)

    const title = await page.title()
    expect(title).toBe("Coin Decider")
  })

  test('should show invalid token error when user is not logged in', async () => {
    const filePath = "http://localhost:3000/#creditmachine";
    await page.goto(filePath);

    await page.evaluate(() => {
      localStorage.removeItem("authToken");
    });

    await new Promise((done) => setTimeout(done, 1000))

    const errorMessage = await page.$eval("#userbalance", (el) => el.textContent);
    expect(errorMessage).toBe("Error: Invalid token");
  })
})
