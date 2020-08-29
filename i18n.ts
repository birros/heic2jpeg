import NextI18Next from 'next-i18next'
import path from 'path'
import NextConfig from 'next/config'

const isProd = process.env.NODE_ENV === 'production'
const { localeSubpaths } = NextConfig().publicRuntimeConfig

const {
  Trans,
  Link,
  Router,
  i18n,
  initPromise,
  config,
  useTranslation,
  withTranslation,
  appWithTranslation,
} = new NextI18Next({
  defaultLanguage: 'en',
  otherLanguages: ['fr'],
  localeSubpaths,
  localePath: path.resolve(
    isProd && process.browser
      ? './heic2jpeg/static/locales'
      : './public/static/locales'
  ),
})

export {
  Trans,
  Link,
  Router,
  i18n,
  initPromise,
  config,
  useTranslation,
  withTranslation,
  appWithTranslation,
}
