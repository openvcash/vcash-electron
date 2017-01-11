import React from 'react'
import { render } from 'react-dom'
import { I18nextProvider } from 'react-i18next'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'
import { useStrict } from 'mobx'
import { Provider } from 'mobx-react'
import i18next from './utilities/i18next'
import './utilities/rightClickMenu'

/** Main container components. */
import Addresses from './components/Addresses'
import Maintenance from './components/Maintenance'
import Root from './components/Root'
import Transactions from './components/Transactions'

/** Store instances. */
import addresses from './stores/addresses'
import network from './stores/network'
import rates from './stores/rates'
import rewardCalculator from './stores/rewardCalculator'
import rpc from './stores/rpc'
import send from './stores/send'
import transactions from './stores/transactions'
import ui from './stores/ui'
import wallet from './stores/wallet'

/** Use MobX strict mode, allowing only actions to alter the state. */
useStrict(true)

const stores = {
  addresses,
  network,
  rates,
  rewardCalculator,
  rpc,
  send,
  transactions,
  ui,
  wallet
}

render(
  <Provider {...stores}>
    <I18nextProvider i18n={i18next}>
      <Router history={hashHistory}>
        <Route path='/' component={Root}>
          <IndexRoute component={Transactions} />
          <Route path='addresses' component={Addresses} />
          <Route path='maintenance' component={Maintenance} />
        </Route>
      </Router>
    </I18nextProvider>
  </Provider>,
  document.getElementById('ui-root')
)
