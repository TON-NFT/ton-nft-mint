import TonWeb from 'tonweb'
import tonMnemonic from 'tonweb-mnemonic'
const { mnemonicToKeyPair } = tonMnemonic

export const apiKey = 'be776176a149e646fc1630392d69f9ddb28749397661c374a81aab8b25871efe'

export const tonApiUrl = 'https://toncenter.com/api/v2/jsonRPC'

export const tonweb = new TonWeb(new TonWeb.HttpProvider(tonApiUrl, { apiKey }))

export const wc = 0
export const sendMode = 3
export const version = 'v4R2'
export const TX_AMOUNT = '0.05'
export const startIndex = -1

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export { tonMnemonic, mnemonicToKeyPair, TonWeb }