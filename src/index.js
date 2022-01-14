/** @format */

/** r*/
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './app/App'
import reportWebVitals from './reportWebVitals'
import { CookiesProvider } from 'react-cookie'
import { BrowserRouter } from 'react-router-dom'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import InfoCookieReducer from './reducers/InfoCookieReducer'


const Store = createStore(InfoCookieReducer);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={Store} >
    
    <CookiesProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CookiesProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)

reportWebVitals()
