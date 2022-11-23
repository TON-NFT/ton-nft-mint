import { prepareCollection } from './prepareCollection.js'
import { TonWeb, sendMode, TX_AMOUNT } from './_utils.js'

export async function mintNFT(config, itemOwnerAddress) {
  const { nftCollection, collectionConfig } = await prepareCollection(config)

  const secretKey = collectionConfig.secretKey

  itemOwnerAddress = new TonWeb.utils.Address(itemOwnerAddress)

  const currentCollectionState = await nftCollection.getCollectionData()

  const itemIndex = currentCollectionState.nextItemIndex

  if (itemIndex >= collectionConfig.limit) return

  const amount = TonWeb.utils.toNano(TX_AMOUNT)
  const seqno = await collectionConfig._wallet.methods.seqno().call() || 0

  const itemContentUri = `${itemIndex}.json`

  const mintData = { amount, itemIndex, itemOwnerAddress, itemContentUri }
  const payload = nftCollection.createMintBody(mintData)

  const toAddress = nftCollection.address

  const deployNftTX = { secretKey, toAddress, amount, seqno, payload, sendMode }

  await collectionConfig._wallet.methods.transfer(deployNftTX).send()
}