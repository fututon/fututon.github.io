import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";

import App from "./App.jsx";
import { Provider } from "./provider.tsx";
import "./styles/globals.css";


import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TonConnectUIProvider } from "@tonconnect/ui-react";


// this manifest is used temporarily for development purposes
const manifestUrl =
    "https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json";

const queryClient = new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

import WebApp from '@twa-dev/sdk'

console.log(WebApp)

// window['w'] = WebApp


import eruda from 'eruda';

eruda.init()

//
import { SDKProvider } from '@telegram-apps/sdk-react';



import { mockTelegramEnv, parseInitData } from '@telegram-apps/sdk';

if (import.meta.env.DEV) {

  const initDataRaw = new URLSearchParams([
    ['user', JSON.stringify({
      id: 99281932,
      first_name: 'Andrew',
      last_name: 'Rogue',
      username: 'rogue',
      language_code: 'en',
      is_premium: true,
      allows_write_to_pm: true,
    })],
    ['hash', '89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31'],
    ['auth_date', '1716922846'],
    ['start_param', 'debug'],
    ['chat_type', 'sender'],
    ['chat_instance', '8428209589180549439'],
  ]).toString();

  mockTelegramEnv({
    themeParams: {
      accentTextColor: '#6ab2f2',
      bgColor: '#17212b',
      buttonColor: '#5288c1',
      buttonTextColor: '#ffffff',
      destructiveTextColor: '#ec3942',
      headerBgColor: '#17212b',
      hintColor: '#708499',
      linkColor: '#6ab3f3',
      secondaryBgColor: '#232e3c',
      sectionBgColor: '#17212b',
      sectionHeaderTextColor: '#6ab3f3',
      subtitleTextColor: '#708499',
      textColor: '#f5f5f5',
    },
    initData: parseInitData(initDataRaw),
    initDataRaw,
    version: '7.2',
    platform: 'tdesktop',
  });
}




ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
        <TonConnectUIProvider manifestUrl={manifestUrl}>
          <SDKProvider acceptCustomStyles debug>
            <QueryClientProvider client={queryClient}>
              <Provider>
                <App />
              </Provider>
            </QueryClientProvider>
          </SDKProvider>
        </TonConnectUIProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
