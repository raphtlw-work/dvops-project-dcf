import puppeteer, { Browser, Page } from "puppeteer"

let browser: Browser | null = null

export const initializeBrowser = async (): Promise<Browser> => {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      defaultViewport: null,
      slowMo: 25,
    })
  }
  return browser
}

export const closeBrowser = async (): Promise<void> => {
  if (browser) {
    await browser.close()
    browser = null
  }
}

export const createNewPage = async (): Promise<Page> => {
  if (!browser) {
    await initializeBrowser()
  }
  return browser!.newPage()
}
