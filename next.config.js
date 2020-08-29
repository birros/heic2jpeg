const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  basePath: isProd ? '/heic2jpeg' : '',
  assetPrefix: isProd ? '/heic2jpeg/' : '',
}
