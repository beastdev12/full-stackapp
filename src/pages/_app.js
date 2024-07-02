// ** Next Imports
import Head from 'next/head';
import { Router } from 'next/router';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import NProgress from 'nprogress';
import config from 'config.js'; // Adjusted the import to ensure correct path

// ** Emotion Imports
import { CacheProvider } from '@emotion/react';

// ** Config Imports
import themeConfig from 'src/configs/themeConfig';

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout';
import ThemeComponent from 'src/@core/theme/ThemeComponent';

// ** Contexts
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext';

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache';

// ** React Perfect Scrollbar Style
import 'react-perfect-scrollbar/dist/css/styles.css';

// ** Global css styles
import '../../styles/globals.css';

const clientSideEmotionCache = createEmotionCache();

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start();
  });
  Router.events.on('routeChangeError', () => {
    NProgress.done();
  });
  Router.events.on('routeChangeComplete', () => {
    NProgress.done();
  });
}

// ** Configure JSS & ClassName
const App = props => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCalledApi, setHasCalledApi] = useState(false);

  // Initial API call to warm up the server
  useEffect(() => {
    const callInitialApi = async () => {
      try {
        const response = await fetch(`${config.apiBaseUrl}/api/data`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('API call successful, data:', data);
          setHasCalledApi(true);
          sessionStorage.setItem('hasCalledApi', 'true');
        } else {
          console.error('API call failed');
        }
      } catch (error) {
        console.error('Error during API call:', error);
      }
    };

    // Check if the API call has already been made during this session
    if (!hasCalledApi && !sessionStorage.getItem('hasCalledApi')) {
      callInitialApi();
    }
  }, [hasCalledApi]);

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      // Your authentication logic here
      // If user is not authenticated, redirect to login page
      if (!isAuthenticated && router.pathname !== '/') {
        router.push('/');
      }
    };

    checkAuth();
  }, [isAuthenticated, router]);

  // Layout configuration
  const getLayout = Component.getLayout ?? (page => (
    <UserLayout isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}>
      {page}
    </UserLayout>
  ));

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>{`${themeConfig.templateName} - Admin App`}</title>
        <meta
          name='description'
          content={`${themeConfig.templateName} - Something about the Company`}
        />
        <meta name='keywords' content='Some keywords here' />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>

      <SettingsProvider>
        <SettingsConsumer>
          {({ settings }) => (
            <ThemeComponent settings={settings} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}>
              {getLayout(
                <Component
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                  {...pageProps}
                />
              )}
            </ThemeComponent>
          )}
        </SettingsConsumer>
      </SettingsProvider>
    </CacheProvider>
  );
};

export default App;
