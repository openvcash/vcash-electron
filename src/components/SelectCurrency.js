import React from 'react'
import { translate } from 'react-i18next'
import { inject, observer } from 'mobx-react'
import { Select } from 'antd'

/** Load translation namespaces and delay rendering until they are loaded. */
@translate(['wallet'], { wait: true })

/** Make the component reactive and inject MobX stores. */
@inject('rates') @observer

class SelectCurrency extends React.Component {
  constructor (props) {
    super(props)
    this.rates = props.rates
    this.t = props.t
    this.setLocalCurrency = this.setLocalCurrency.bind(this)
  }

  setLocalCurrency (value) {
    this.rates.setLocalCurrency(value)
  }

  render () {
    return (
      <Select
        showSearch
        style={{width: '80px'}}
        defaultValue={this.rates.localCurrency}
        optionFilterProp='children'
        notFoundContent={this.t('wallet:notFound')}
        onChange={this.setLocalCurrency}
      >
        {
          this.rates.localCurrencies.map((currency) => (
            <Select.Option
              key={currency}
              value={currency}
            >
              {currency}
            </Select.Option>
          ))
        }
      </Select>
    )
  }
}

export default SelectCurrency
