import { action, computed, observable, reaction } from 'mobx'
import { notification } from 'antd'
import i18next from '../utilities/i18next'

/** Required store instances. */
import rpc from './rpc'
import wallet from './wallet'

class WalletUnlock {
  /**
   * Observable properties.
   * @property {string} passphrase - Passphrase.
   * @property {boolean} popover - Popover visibility status.
   * @property {object} errors - RPC response errors.
   */
  @observable passphrase = ''
  @observable popover = false
  @observable errors = {
    incorrectPassphrase: false
  }

  constructor () {
    /** Clear previous RPC response errors on passphrase change. */
    reaction(() => this.passphrase, (passphrase) => {
      if (this.errors.incorrectPassphrase === true) this.toggleError()
    })

    /** Clear passphrase field when popover closes. */
    reaction(() => this.popover, (popover) => {
      if (popover === false) {
        if (this.passphrase !== '') this.setPassphrase()
      }
    })
  }

  /**
   * Get error status.
   * @function errorStatus
   * @return {string|boolean} Current error or false if none.
   */
  @computed get errorStatus () {
    if (this.passphrase.length < 1) return 'emptyField'
    if (this.errors.incorrectPassphrase === true) return 'incorrectPassphrase'
    return false
  }

  /**
   * Toggle RPC response error status.
   * @function toggleError
   * @param {string} key - Error key to toggle.
   */
  @action toggleError (key = '') {
    if (key === '') {
      /** Clear all errors if no key provided. */
      for (let i in this.errors) {
        if (this.errors[i] === true) this.errors[i] = false
      }
    } else {
      this.errors[key] = !this.errors[key]
    }
  }

  /**
   * Set passphrase.
   * @function setPassphrase
   * @param {string} passphrase - Passphrase.
   */
  @action setPassphrase (passphrase = '') {
    this.passphrase = passphrase
  }

  /**
   * Toggle popover visibility.
   * @function togglePopover
   */
  @action togglePopover () {
    this.popover = !this.popover
  }

  /**
   * Unlock the wallet.
   * @function walletpassphrase
   */
  walletpassphrase () {
    rpc.call([
      {
        method: 'walletpassphrase',
        params: [this.passphrase]
      }
    ], (response) => {
      if (response !== null) {
        if (response[0].hasOwnProperty('error') === true) {
          switch (response[0].error.code) {
            /**
             * Incorrect passphrase,
             * error_code_wallet_passphrase_incorrect = -14
             */
            case -14:
              return this.toggleError('incorrectPassphrase')
          }
        }

        /** Close popover. */
        this.togglePopover()

        /** Update wallet status. */
        wallet.lockCheck()

        /** Display notification. */
        notification.success({
          message: i18next.t('wallet:unlocked'),
          description: i18next.t('wallet:unlockedLong'),
          duration: 6
        })
      }
    })
  }
}

/** Initialize a new globally used store. */
const walletUnlock = new WalletUnlock()

/**
 * Export initialized store as default export,
 * and store class as named export.
 */
export default walletUnlock
export { WalletUnlock }
