export const init = () => Promise.resolve()

const userId = 'userId'

export const getAvailableActions = async query => {
  return [
    {
      type: 'get-company-info',
      id: `get-company-info-${query}`,
      label: query,
      subLabel: 'company info',
      section: 'companies',
      priority: 6,
      icon: 'question',
      detail: 'get-legal-information',
      payload: {
        company: {
          name: query,
        },
      },
    },
  ]
}

export const executionAction = async ({ action, query, close, keep }) => {}

export const getData = async ({ request, action }) => {
  if (request.type === 'get-legal-information') {
    return {
      name: 'POLLEN METROLOGY',
      address: '122 RUE DU ROCHER DE LORZIER 38430 MOIRANS',
      createdAt: '29-09-2014',
      legal: {
        SIREN: '804 862 043',
        SIRET: '80486204300036',
      },
    }
  }

  return null
}
