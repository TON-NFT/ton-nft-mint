import { deployCollection, mintNFT } from './app.js'

/* ---------------------- EXAMPLE USAGE ---------------------- */

/* Config example */
const config = {
  wallet: {
    address: 'EQAKxNqUgLNnSILkjlVeBdOYGjmC_Uw6-o5X-KOOiWFj7VY_',
    mnemonic: 'rookie practice captain produce tumble dish dinosaur beyond horse total smooth stay profit snack slush essay acquire hobby claim caught camera promote boring girl',
  },
  collectionData: {
    royalty: 10,
    royaltyAddress: 'EQAKxNqUgLNnSILkjlVeBdOYGjmC_Uw6-o5X-KOOiWFj7VY_',
    collectionJson: 'https://cdn.ton.beauty/test-collection/collection/data.json',
    nftJsonBase: 'https://test-collection.ton.beauty/metadata/',
    limit: 5000,
  },
}

/* Make sure your wallet already activated and v4R2 version */
const collection = await deployCollection(config)
console.log(collection)

/* Call this method after collection contract already deployed */
const itemOwnerAddress = 'EQAd_LCfdJb_Iqz5ZOfyMI9bmJfU_Fz2SN-Gx3wcG33d2tiz'
const mintResult = await mintNFT(config, itemOwnerAddress)
console.log(mintResult)