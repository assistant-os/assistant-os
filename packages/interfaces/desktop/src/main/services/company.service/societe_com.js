import https from 'https'
import url from 'url'
import cheerio from 'cheerio' // https://github.com/cheeriojs/cheerio

import logger from '../../utils/logger'

const defaultUrl = {
  protocol: 'https',
  hostname: 'www.societe.com',
}

const requestPage = uri =>
  new Promise((resolve, reject) => {
    https
      .get(uri, res => {
        res.setEncoding('utf8')
        let body = ''
        res.on('data', data => {
          body += data
        })

        res.on('end', () => {
          resolve(body)
        })
      })
      .on('error', error => {
        reject(error)
      })
      .end()
  })

export const getCompaniesByName = companyName =>
  new Promise((resolve, reject) => {
    const uri = url.format({
      ...defaultUrl,
      pathname: '/cgi-bin/search',
      query: {
        champs: companyName,
      },
    })

    requestPage(uri)
      .then(body => {
        const $ = cheerio.load(body)

        const results = []

        $('.monocadre').each((i, category) => {
          if (
            $(category)
              .text()
              .includes('sultat exact')
          ) {
            $(category)
              .find('a.txt-no-underline')
              .each((n, item) => {
                let name = $(item)
                  .find('.resultat .lien')
                  .text()
                  .toLowerCase()

                name = `${name.charAt(0).toUpperCase()}${name.slice(1)}`

                if (name) {
                  results.push({
                    name,
                    link: url.format({
                      ...defaultUrl,
                      pathname: $(item).attr('href'),
                    }),
                  })
                }
              })
          }
        })

        if (results.length > 0) {
          resolve(results)
        } else {
          reject()
        }
      })
      .catch(error => {
        logger.error('error while requesting societe.com ', { error })
        reject()
      })
  })

export const clean = (str, companyName) =>
  str
    .replace(/\n/g, '')
    .replace(/,/g, '')
    .replace(companyName.toUpperCase(), '')
    .trim()

export const getCompanyDetails = ({ name, link }) =>
  new Promise((resolve, reject) => {
    requestPage(link)
      .then(body => {
        const $ = cheerio.load(body)

        const query = '.FicheRenseignement .identity tbody td'

        const address = clean(
          $(query)
            .eq(7)
            .text(),
          name
        )
        const siren = $(query)
          .eq(12)
          .text()
        const siret = $(query)
          .eq(14)
          .text()

        const activity = $(query)
          .eq(18)
          .text()

        const type = $(query)
          .eq(20)
          .text()

        const createdAt = $(query)
          .eq(25)
          .text()
          .replace('Voir les statuts constitutifs', '')
          .trim()

        const company = {
          name,
          link,
          address,
          siren,
          siret,
          activity,
          type,
          createdAt,
        }

        logger.info('company', { company })

        resolve(company)
      })
      .catch(error => {
        logger.error('error while requesting detail societe.com ', { error })
        reject()
      })
  })

export const getCompanyDetailsByName = companyName =>
  getCompaniesByName(companyName).then(companies => {
    if (companies.length > 0) {
      return getCompanyDetails(companies[0])
    } else {
      throw new Error()
    }
  })
