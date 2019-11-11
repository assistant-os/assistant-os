import https from 'https'
import url from 'url'
import cheerio from 'cheerio' // https://github.com/cheeriojs/cheerio

import { logger } from '@assistant-os/utils'

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

    logger.info('requesting company', { uri })

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
                const name = $(item)
                  .find('.resultat .lien')
                  .text()
                  .toLowerCase()

                if (name) {
                  results.push({
                    probability: 1,
                    company: {
                      name,
                      link: url.format({
                        ...defaultUrl,
                        pathname: $(item).attr('href'),
                      }),
                    },
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
          .eq(11)
          .text()
        const siret = $(query)
          .eq(13)
          .text()

        const activity = $(query)
          .eq(17)
          .text()

        const type = $(query)
          .eq(19)
          .text()

        const createdAt = $(query)
          .eq(21)
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

export const displayCompany = ({ name, address, siren, siret }) =>
  `${name}: ${address} / SIREN: ${siren} / SIRET: ${siret}`
