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
    "should navigate to the sign-in page and login",
    async () => {
      await page.evaluate(() => {
        window.localStorage.removeItem("authToken")
      })

      await page.click(".get-started-btn")

      const emailInput = await page.waitForSelector("#login-email", {
        visible: true,
        timeout: 3000,
      })
      const passwordInput = await page.waitForSelector("#login-password", {
        visible: true,
        timeout: 3000,
      })

      await emailInput!.type("hey@hey.com")
      await passwordInput!.type("Password1$")

      await page.click("#login-form button[type=submit]")

      const userProfileSelector = "#profile-username"

      const userProfileText = await page.$eval(userProfileSelector, (el) =>
        el.textContent?.trim(),
      )
      expect(userProfileText).toBe("hey") // Update with expected content
    },
    70 * 1000,
  )

  test(
    "should fetch and display user balance",
    async () => {
      const balanceSelector = "#user-balance"

      // Mock /user/balance response
      await page.setRequestInterception(true)
      page.on("request", (request) => {
        if (request.url().includes("/user/balance")) {
          request.respond({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({ balance: "100" }),
          })
        } else {
          request
            .continue()
            .catch((err) => console.error("Request error:", err))
        }
      })

      // Reload page to trigger the balance fetch
      await page.waitForSelector(balanceSelector, { visible: true })
      const balanceText = await page.$eval(balanceSelector, (el) =>
        el.textContent?.trim(),
      )

      expect(balanceText).toBe("100")

      // Clean up interception
      page.removeAllListeners("request")
      await page.setRequestInterception(false)
    },
    70 * 1000,
  )

  test(
    'should handle "Insufficient balance" error',
    async () => {
      const resultSelector = "#result"

      // Mock insufficient balance response
      await page.setRequestInterception(true)
      page.on("request", (request) => {
        if (request.url().includes("/coinflip")) {
          request.respond({
            status: 400,
            contentType: "application/json",
            body: JSON.stringify({ error: "Insufficient balance" }),
          })
        } else {
          request
            .continue()
            .catch((err) => console.error("Request error:", err))
        }
      })

      // Simulate user input
      await page.click('input[name="choice"][value="heads"]')
      await page.click("#flip-coin-btn")

      // Verify error message
      await page.waitForSelector(resultSelector, { visible: true })
      const resultText = await page.$eval(resultSelector, (el) =>
        el.textContent?.trim(),
      )

      expect(resultText).toBe("You have insufficient balance to play.")

      // Clean up interception
      page.removeAllListeners("request")
      await page.setRequestInterception(false)
    },
    70 * 1000,
  )

  test(
    "should flip the coin and display result",
    async () => {
      const resultSelector = "#result"
      const balanceSelector = "#userbalance"

      // Mock coin flip response
      await page.setRequestInterception(true)
      page.on("request", (request) => {
        if (request.url().includes("/coinflip")) {
          request.respond({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
              message: "Congratulations, you won!",
              balance: "120",
            }),
          })
        } else {
          request
            .continue()
            .catch((err) => console.error("Request error:", err))
        }
      })

      // Simulate user input
      await page.click('input[name="choice"][value="heads"]')
      await page.click("#flip-coin-btn")

      // Verify result and updated balance
      await page.waitForSelector(resultSelector, { visible: true })
      const resultText = await page.$eval(resultSelector, (el) =>
        el.textContent?.trim(),
      )
      const balanceText = await page.$eval(balanceSelector, (el) =>
        el.textContent?.trim(),
      )

      expect(resultText).toBe("Congratulations, you won!")
      expect(balanceText).toBe("120")

      // Clean up interception
      page.removeAllListeners("request")
      await page.setRequestInterception(false)
    },
    70 * 1000,
  )
})
