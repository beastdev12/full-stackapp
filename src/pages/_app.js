// ** Next Imports
import Head from 'next/head'
import { Router } from 'next/router'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'

// ** Config Imports
import themeConfig from 'src/configs/themeConfig'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import ThemeComponent from 'src/@core/theme/ThemeComponent'

// ** Contexts
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css'

// ** Global css styles
import '../../styles/globals.css'
import { Icon } from '@mui/material'

const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {

    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {

    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {

    NProgress.done()
  })
}

// ** Configure JSS & ClassName
const App = props => {

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {
    const checkAuth = async () => {
      // Your authentication logic here
      // If user is not authenticated, redirect to login page
      if (!isAuthenticated) {
        router.push('/');
      }
    };

    checkAuth();
  }, [isAuthenticated, router]);

  // Variables
  const getLayout = Component.getLayout ?? (page => <UserLayout isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}>{page}</UserLayout>)

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>{`${themeConfig.templateName} - Admin App`}</title>
        <meta
          name='description'
          content={`${themeConfig.templateName} Somthing about the Company`}
        />
        <meta name='keywords' content='SOme keywords here' />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>

      <SettingsProvider>
        <SettingsConsumer>
          {({ settings }) => {
            
            return <ThemeComponent settings={settings} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}>{getLayout(<Component isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} {...pageProps} />)}</ThemeComponent>
          }}
        </SettingsConsumer>
      </SettingsProvider>
    </CacheProvider>
  )
}

export default App
