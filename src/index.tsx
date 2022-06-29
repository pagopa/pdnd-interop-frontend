import { noncedCache } from './lib/emotion-cache'
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { App } from './App'
import reportWebVitals from './reportWebVitals'
import './config/i18n'
import { CacheProvider } from '@emotion/react'

ReactDOM.render(
  <React.StrictMode>
    <CacheProvider value={noncedCache}>
      <App />
    </CacheProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
