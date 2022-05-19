import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpApi from 'i18next-http-backend'

i18n
  .use(initReactI18next)
  .use(HttpApi)
  .init({
    debug: false,
    fallbackLng: 'it',
    resources: {
      it: {
        common: {
          mode: {
            provider: 'erogazione',
            subscriber: 'fruizione',
          },
        },
        'shared-components': {
          pageReloadMessage: {
            message: 'Non siamo riusciti a recuperare i dati',
            cta: 'Ricarica la pagina',
          },
        },
        eservice: {
          create: {
            forwardWithSaveBtn: 'Salva bozza e prosegui',
            step1: {
              detailsTitle: 'Caratterizzazione E-Service',
              eserviceNameField: {
                label: "Nome dell'E-Service (richiesto)",
              },
              eserviceDescriptionField: {
                label: "Descrizione dell'E-Service (richiesto)",
              },
              attributes: {
                title: 'Attributi',
                addAttributeTable: {
                  noDataLabel: 'Nessun attributo presente',
                },
              },
            },
          },
        },
      },
    },
  })

export default i18n
