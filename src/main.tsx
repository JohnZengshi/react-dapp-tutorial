import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import "../app/globals.css"
import { MetaMaskProvider } from '@metamask/sdk-react'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MetaMaskProvider debug={false} sdkOptions={{
      dappMetadata: {
        name: "Example React Dapp",
        url: window.location.host,
      },
      checkInstallationImmediately: false
      // Other options
    }}>
      <App />
    </MetaMaskProvider>
  </React.StrictMode>,
)
