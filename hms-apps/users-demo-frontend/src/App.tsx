import { Route, Routes, useParams } from "react-router-dom"
import Layout from "./components/Layout"
import Home from "./components/Home";
import Users from "./components/Users";
import { ThemeProvider } from "@/components/theme-provider"
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { Suspense, createContext, useEffect } from "react";
import { DEV_MODE } from "./global/frontend.setings";
import { useTranslation } from 'react-i18next';
import { AppContextType } from "./global/contexts";


type Props = {
  assetMap?: {
    'styles.css': string;
    'main.js': string;
    'manifest'?: string;
    'vite-plugin-pwa:register-sw'?: string;
    'additional-styles': string[];
    'additional-jss': string[];
    initialContentMap: {
      'title': string;
      'description'?: string;
      'hello-message'?: string;
    };
    baseUrl: string;
    initialI18nStore?: {};
    initialLanguage?: string;
    clientFirstAcceptLanguage?: string;
  };
}

export const AppContext = createContext<AppContextType | null>(null);

const App: React.FC<Props> = ({ assetMap }) => {
  const queryClient = new QueryClient();
  const { i18n } = useTranslation();

  const changeI18nLanguageToClientPreferred = async () => {
    if (i18n.language !== assetMap?.clientFirstAcceptLanguage) {
      await i18n.changeLanguage(assetMap?.clientFirstAcceptLanguage);
    }
  };

  useEffect(() => {
    // Check if assetMap sent in production mode; if not, redirect to a proper ssr endpoint.
    if (!DEV_MODE) {
      // Attempt to change language here to locale
      changeI18nLanguageToClientPreferred();
      if (!assetMap) {
        window.location.href = '/web'; // Simulate a mouse click
      }
    }
  }, [i18n.language, assetMap]);

  const appBody = () => {
    // Can be used at DEV time and PROD time

    // Default settings on dev mode
    let baseUrl = '/v1';
    let title = 'Hello World';

    if (assetMap) {
      // Prod mode. Sent by ssr endpoint.
      baseUrl = assetMap.baseUrl;
      title = assetMap.initialContentMap.title!;
    }

    return (
      // Provide the client to your App
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Routes>
            <Route path={baseUrl} element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="view-users" element={<Users />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </QueryClientProvider>
    )
  };

  const additionStyles = () => {
    if (assetMap) {
      return assetMap['additional-styles'].map((additionalStyle) => (
        <link rel="stylesheet" href={additionalStyle} key={additionalStyle} />
      ));
    }
    return null;
  };

  const additionalJss = () => {
    if (assetMap) {
      return assetMap['additional-jss'].map((additionalJs) => (
        <script src={additionalJs} key={additionalJs} />
      ));
    }
    return null;
  };

  const output = () => {
    if (assetMap) {
      return (
        <html>
          <head>
            <link rel="stylesheet" href={assetMap['styles.css']} />
            {additionStyles()}
            {assetMap['manifest'] && <link rel="manifest" href={assetMap['manifest']}></link>}
            {assetMap['vite-plugin-pwa:register-sw'] && (
              <script id="vite-plugin-pwa:register-sw" src="/registerSW.js"></script>
            )}
            {assetMap.initialContentMap && <title>{assetMap.initialContentMap['title']}</title>}
          </head>
          {appBody()}
          {additionalJss()}
        </html>
      );
    } else {
      return <>{appBody()}</>;
    }
  };

  return <>{output()}</>;
};

const UseParams: React.FC = () => {
  let { name } = useParams();
  return <h3>Hello {name}</h3>;
};

export default App
