import NextI18Next from 'next-i18next'
import path from 'path'
import NextConfig from 'next/config'

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
  localePath: path.resolve('./public/static/locales'),
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
