import { Page } from "puppeteer"
import { closeBrowser, createNewPage } from "../util/puppeteer"

describe("Coin Decider Frontend Tests", () => {
  let page: Page

  beforeAll(async () => {
    page = await createNewPage()
    await page.goto("http://localhost:3000")
  }, 70 * 1000)

  afterAll(async () => {
    await closeBrowser()
  }, 70 * 1000)

  test(
    "should load the Coin Decider homepage",
    async () => {
      await page.goto("http://localhost:3000")

      const title = await page.title()
      expect(title).toBe("Coin Decider")
    },
    70 * 1000,
  )

  test(
    'should display the "Get started" button',
    async () => {
      await page.evaluate(() => {
        localStorage.removeItem("authToken")
      })

      const buttonText = await page.$eval(".get-started-btn", (btn) =>
        btn.textContent?.trim(),
      )
      expect(buttonText).toBe("Get started")
    },
    70 * 1000,
  )

  test(
    'should navigate to login view when "Get started" is clicked',
    async () => {
      await page.click(".get-started-btn")

      const isLoginViewVisible = await page.$eval("#view-login", (el) => {
        return !el.classList.contains("hidden")
      })
      expect(isLoginViewVisible).toBe(true)
    },
    70 * 1000,
  )

  test(
    'should show current balance as "Loading" on balance navigation',
    async () => {
      const balanceText = await page.$eval("#user-balance", (el) =>
        el.textContent?.trim(),
      )
      expect(balanceText).toBe("Loading")
    },
    70 * 1000,
  )
})
