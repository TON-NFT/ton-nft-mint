import { mnemonicToKeyPair, tonweb, TonWeb, version, wc } from './_utils.js'
const { NftItem, NftCollection } = TonWeb.token.nft

export async function prepareCollection(collectionConfig) {
  if (!collectionConfig.collectionData.royaltyAddress) collectionData.royaltyAddress = collectionConfig.wallet.address

  const words = collectionConfig.wallet.mnemonic.split(' ')

  const { publicKey, secretKey } = await mnemonicToKeyPair(words)

  collectionConfig.publicKey = publicKey
  collectionConfig.secretKey = secretKey

  const WalletClass = tonweb.wallet.all[version]

  collectionConfig._wallet = new WalletClass(tonweb.provider, { publicKey, wc })

  collectionConfig._walletAddress = await collectionConfig._wallet.getAddress()

  collectionConfig._royaltyAddress = new TonWeb.utils.Address(collectionConfig.collectionData.royaltyAddress)

  const createCollectionParams = {
    ownerAddress: collectionConfig._walletAddress,
    royalty: collectionConfig.collectionData.royalty / 100,
    royaltyAddress: collectionConfig._royaltyAddress,
    collectionContentUri: collectionConfig.collectionData.collectionJson,
    nftItemContentBaseUri: collectionConfig.collectionData.nftJsonBase,
    nftItemCodeHex: NftItem.codeHex,
  }

  const nftCollection = new NftCollection(tonweb.provider, createCollectionParams)

  nftCollection.address = await nftCollection.getAddress()

  return { nftCollection, collectionConfig }
}