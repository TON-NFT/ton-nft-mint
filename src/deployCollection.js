import { prepareCollection } from './prepareCollection.js'
import { TonWeb, sendMode } from './_utils.js'

export async function deployCollection(config) {
  const { nftCollection, collectionConfig } = await prepareCollection(config)

  const secretKey = collectionConfig.secretKey

  const seqno = await collectionConfig._wallet.methods.seqno().call() || 0
  const toAddress = nftCollection.address.toString(true, true, false)
  const deployAmount = String((0.1 * 10).toFixed(2))
  const amount = TonWeb.utils.toNano(deployAmount)

  const stateInit = (await nftCollection.createStateInit()).stateInit

  const payload = ''

  const deployCollectionTX = { secretKey, toAddress, amount, seqno, payload, sendMode, stateInit }

  try {
    collectionConfig._wallet.methods.transfer(deployCollectionTX).send()
    console.log(`Please, check your new collection wallet https://tonscan.org/address/${toAddress}`)
    return toAddress
  } catch(e) {
    console.log(e)
    return false
  }
}