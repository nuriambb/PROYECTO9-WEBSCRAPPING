const puppeteer = require('puppeteer')
const fs = require('fs')

const arrayGuitars = []
const scrapperPage = async () => {
  const url = 'https://www.thomann.de/es/sets_de_guitarra.html'
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null
  })
  const page = await browser.newPage()
  await page.goto(url)
  const cookies =
    '.fx-button.fx-button--icon-left.consent-button.consent-button--primary.js-accept-all-cookies.spicy-consent-bar__action.spicy-consent-bar__action-accept'

  await page.waitForSelector(cookies)
  const cookiesButton = await page.$(cookies)
  if (cookiesButton) {
    await cookiesButton.click()
  } else {
    console.log('No se encontró el botón de cookies')
  }

  repeat(page, browser)
}

const repeat = async (page, browser) => {
  const titlesSet = new Set()
  const arrayDivs = await page.$$('.product')
  for (const guitarDiv of arrayDivs) {
    let imgDiv = await guitarDiv.$('.product__image')
    let img = await imgDiv.$eval('img', (el) => el.src)

    let txtDiv = await guitarDiv.$('.product__title.fx-text')
    let title = await txtDiv.$$eval('span', (spans) =>
      spans.map((span) => span.textContent)
    )
    const titleJoined = title.join(',')
    if (titlesSet.has(titleJoined)) {
      continue
    }
    titlesSet.add(titleJoined)

    let price = await guitarDiv.$eval(
      '.fx-typography-price-primary.fx-price-group__primary.product__price-primary',
      (el) => parseFloat(el.textContent.slice(0, el.textContent.length - 1))
    )

    try {
      let stock = 'No disponible'
      const detailsDiv = await guitarDiv.$('.product__details')
      let stockTrueElement = await detailsDiv.$(
        '.fx-availability.fx-availability--in-stock'
      )

      let stockFalseElement = await detailsDiv.$(
        '.fx-availability.fx-availability--short-term'
      )
      let stockFalseElement2 = await detailsDiv.$(
        '.fx-availability.fx-availability--on-date'
      )
      if (stockTrueElement) {
        stock = await detailsDiv.$eval(
          '.fx-availability.fx-availability--in-stock',
          (el) => el.textContent.split('close-tooltip')[0].trim()
        )
      } else if (stockFalseElement) {
        stock = await detailsDiv.$eval(
          '.fx-availability.fx-availability--short-term',
          (el) => el.textContent.split('close-tooltip')[0].trim()
        )
      } else if (stockFalseElement2) {
        stock = await detailsDiv.$eval(
          '.fx-availability.fx-availability--on-date',
          (el) => el.textContent.split('close-tooltip')[0].trim()
        )
      }

      const guitar = {
        img: img,
        title: titleJoined,
        price: price,
        stock: stock
      }

      arrayGuitars.push(guitar)
    } catch (error) {
      console.log(error)
    }
  }
  try {
    await page.$eval(
      '.fx-button.search-pagination__show-more.fx-button--primary',
      (el) => el.click()
    )
    await page.waitForNavigation()
    repeat(page, browser)
  } catch (error) {
    write(arrayGuitars)
    await browser.close()
  }
}
const write = (arrayGuitars) => {
  fs.writeFile('guitars.json', JSON.stringify(arrayGuitars), () => {
    console.log('Archivo escrito')
  })
}
module.exports = { scrapperPage }
