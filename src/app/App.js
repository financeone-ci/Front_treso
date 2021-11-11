/** @format */
import Accueil from '../pages/Accueil'
import Login from '../pages/Login'
import SendPwd from '../pages/SendPwd'
import Page404 from '../pages/Page404'
import { Switch, Route } from 'react-router-dom'

import './App.css'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

const queryClient = new QueryClient()

function App() {
  return (
    <div className='App'>
      <QueryClientProvider client={queryClient}>
        <Switch>
          <Route exact path='/' component={Login} />
          <Route path='/sendpwd' component={SendPwd} />
          <Route path='/accueil' component={Accueil} />
          <Route component={Page404} />
        </Switch>
      </QueryClientProvider>
    </div>
  )
}

export default App
