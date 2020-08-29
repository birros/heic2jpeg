const { nextI18NextRewrites } = require('next-i18next/rewrites')
const isProd = process.env.NODE_ENV === 'production'
const localeSubpaths = {}

module.exports = {
  basePath: isProd ? '/heic2jpeg' : '',
  rewrites: async () => nextI18NextRewrites(localeSubpaths),
  publicRuntimeConfig: {
    localeSubpaths,
  },
}
