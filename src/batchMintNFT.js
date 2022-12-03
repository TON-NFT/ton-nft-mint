import { prepareCollection } from './prepareCollection.js'
import { TonWeb, sendMode, TX_AMOUNT } from './_utils.js'
import { DictBuilder } from 'ton'
import { serializeUri } from 'tonweb/src/contract/token/nft/NftUtils.js'
import { Cell } from 'tonweb/src/boc/index.js'

export async function batchMintNFT(config, itemOwnerAddress, mintCount = 5) {
  const { nftCollection, collectionConfig } = await prepareCollection(config)

  const secretKey = collectionConfig.secretKey

  itemOwnerAddress = new TonWeb.utils.Address(itemOwnerAddress)

  const currentCollectionState = await nftCollection.getCollectionData()

  const nfts = []

  const nextItemIndex = currentCollectionState.nextItemIndex

  if (nextItemIndex >= collectionConfig.limit) return

  const amount = TonWeb.utils.toNano(TX_AMOUNT)
  const seqno = await collectionConfig._wallet.methods.seqno().call() || 0

  for (let itemIndex = nextItemIndex; itemIndex < nextItemIndex + mintCount; itemIndex++) {
    const itemContentUri = `${itemIndex}.json`
    const nft = { itemContentUri, itemOwnerAddress, amount, itemIndex }
    nfts.push(nft)
  }

  const payload = createBatchMintBody({ nfts })

  const toAddress = nftCollection.address

  const deployNftsTX = { secretKey, toAddress, amount, seqno, payload, sendMode }

  try {
    await collectionConfig._wallet.methods.transfer(deployNftsTX).send()
    return true
  } catch(e) {
    console.log(e)
    return false
  }
}

function createBatchMintBody({ queryId = 0, nfts }) {
  const dict = new DictBuilder(64)

  for (const nft of nfts) {
    const contentCell = new Cell()
    contentCell.bits.writeBytes(serializeUri(nft.itemContentUri))

    const dataCell = new Cell()
    dataCell.bits.writeAddress(nft.itemOwnerAddress)
    dataCell.refs[0] = contentCell

    const containerCell = new Cell()
    containerCell.bits.writeCoins(nft.amount)
    containerCell.refs[0] = dataCell

    dict.storeCell(nft.itemIndex, containerCell)
  }

  const finalCell = new Cell()
  finalCell.bits.writeUint(2, 32)
  finalCell.bits.writeUint(queryId ?? 0, 64)
  finalCell.refs[0] = dict.endCell()

  return finalCell
}