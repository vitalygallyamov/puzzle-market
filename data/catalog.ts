import {
    MARKET_DAPP,
    CREATE_DAPP,
    SIGNART_WRAP_DAPP,
    DUCK_WRAPP_DAPP
} from 'helpers/addresses';
import {
  getAllAddressNFT,
  getAllAddressData,
  loadPrices
} from 'helpers/utils';

import {tokenInfo} from 'helpers/tokens';

/**
 * Выгружает все данные для отображения каталога маркета
 */
export const getData = async () => {
    return Promise.all([
        getAllAddressNFT(MARKET_DAPP, 10),
        getAllAddressData(CREATE_DAPP, {
          params: {
              matches: '(nft_|collection_)(.*)'
          }
        }),
        getAllAddressData(MARKET_DAPP, {
          params: {
              matches: '(nft_|auction_|address_)(.*)'
          }
        }),
        getAllAddressData(SIGNART_WRAP_DAPP, {
          params: {
              matches: '(.*)_assetId'
          }
        }),
        getAllAddressData(DUCK_WRAPP_DAPP, {
          params: {
              matches: '(.*)_duckId'
          }
        }),
        loadPrices()
    ]).then(([
        allMarketAddressNFT,
        createDappData,
        marketDappData,
        signartWrapData,
        duckWrapData,
        usdnPrices
    ]) => {
  
        let dappNfts: any = {};
  
        if (allMarketAddressNFT?.length) {
          allMarketAddressNFT.forEach((item) => {
              dappNfts[item.assetId] = item;
          });
          
          // get signart original id
          const wrappedOriginalIds: any = {};
          let regex = /signArtNft_|_assetId/ig;
          signartWrapData.forEach((item) => {
              wrappedOriginalIds[item.key.replace(regex, "")] = item.value;
          });
  
          // get ducks original id
          regex = /nft_|_duckId/ig;
          duckWrapData.forEach((item) => {
              wrappedOriginalIds[item.key.replace(regex, "")] = item.value;
          });

          // set data from issuer dapp
          createDappData.forEach((item) => {
              const [name, assetId, key] = item.key.split('_');
              if (name === 'nft') {
                  if (dappNfts[assetId]) {
                      if (key === 'issuer') {
                          dappNfts[assetId].creator = item.value as string;
                      } else {
                          dappNfts[assetId][key] = item.value;
                      }
                  }
              }
          });
          // set data from market dapp
          marketDappData.forEach((item, index, arr) => {
              const [name, assetId, key] = item.key.split('_');
              if (name === 'nft') {
                  if (dappNfts[assetId]) {
                      dappNfts[assetId][key] = item.value;
                  }
              } else if (name === 'auction') {
                  if (dappNfts[assetId] && item.value) {
                      dappNfts[assetId].bids = (item.value as string).split(',').map((item) => {
                          const parsed = item.split('_');
                          return {
                              key: item,
                              owner: parsed[0],
                              amount: parseInt(parsed[1], 10),
                              usdnPrice: (parseInt(parsed[1], 10) / tokenInfo[parsed[2]].decimals) * (usdnPrices[parsed[2]] || 1),
                              assetId: parsed[2]
                          };
                      }).sort((a, b) => {
                          if (a.usdnPrice > b.usdnPrice ) return 1;
                          if (a.usdnPrice < b.usdnPrice) return -1;
                          return 0;
                      });
                  }
              } else if (name === 'address') {
                  const [, address, , assetId, startSaleKey] = item.key.split('_');
                  if (startSaleKey === 'startSaleAt' && dappNfts[assetId]) {
                      dappNfts[assetId].startSaleAt = item.value;
                  }
              }
          });
  
          // const rawItems: any[] = [];
          return Object.keys(dappNfts).map((key) => {
              // find likes for wrapped
              if (wrappedOriginalIds[key]) {
                  dappNfts[key].likes = marketDappData.find((n) => {
                      return n.key === `nft_${wrappedOriginalIds[key]}_likes`;
                  })?.value || '';
                  dappNfts[key].originalId = wrappedOriginalIds[key];
              }
  
              return {
                  assetId: key,
                  ...dappNfts[key]
              };
          });
  
          // decorate ducks
        //   const ducks = items.filter(item => item.isDuck);
        //   const genotypes: any = ducks.map((item) => {
        //       return {
        //           assetId: item.originalId,
        //           genotype: item.description.match(/DUCK-([A-Z]+-[A-Z]+)/)?.[1] as string
        //       }
        //   });
  
        //   const duckInfoResult = await this.rootStore.walletStore.getDuckInfo(genotypes);
        //   ducks.forEach((duck) => {
        //       if (duckInfoResult?.[duck.originalId]) {
        //           duck.characteristics = duckInfoResult[duck.originalId].params;
        //           duck.achievements = duckInfoResult[duck.originalId].achievements;
        //       }
        //   });
        } else {
          return [];
        }
    });
}