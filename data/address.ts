import {
    MARKET_DAPP,
    CREATE_DAPP,
    SIGNART_WRAP_DAPP,
    DUCK_WRAPP_DAPP
} from 'helpers/addresses';
import {
    getAllAddressNFT,
    getAllAddressData,
    getAssetDetails,
    loadPrices
} from 'helpers/utils';

import {tokenInfo} from 'helpers/tokens';

export async function getData(userAddress: string|null): Promise<any[]> {

    if (userAddress) {

        try {
            // 1. Грузим все нфт пользователя (пока только выпущенные из нашего Дапп)
            let allUserNft = await getAllAddressNFT(userAddress);

            // 2. Грузим те, что на продаже в маркете
            // Получаем список идентификаторов нфт, которые на продаже
            const userNftOnSaleResponse = await getAllAddressData(MARKET_DAPP, {
                matches: `address_${userAddress}_nft_(.*)|auction_(.*)`
            })

            const chunks: any[] = [];
            const auctionChunks: any[] = [];
            let filtered: string[] = [];
            let auction: string[] = [];
            const chunkLimit = 30;

            // filter auctions
            userNftOnSaleResponse
                .filter((item) => {
                    return typeof item.value === 'string' ? item.value.indexOf(userAddress+'_') !== -1 && item.key.indexOf('auction_') !== -1 : false;
                })
                .forEach((item, index, arr) => {
                    const [,assetId,] = item.key.split('_');
                    auction.push(assetId);
                    if (auction.length === chunkLimit) {
                        auctionChunks.push([...auction]);
                        auction = [];
                    }
                });
            if (auction.length) {
                auctionChunks.push([...auction]);
                auction = [];
            }

            // await axios.get<IAddressDataResponse>(`${MAINNET_ADDRESS}/addresses/data/${MAINNET_MARKET_DAPP}?matches=address_%28.%2A%29_nft_%28.%2A%5B%5E_startSaleAt%5D%29%24`);
            userNftOnSaleResponse
                .filter(item => item.key.indexOf(userAddress) !== -1 && item.key.indexOf('_startSaleAt') === -1)
                .forEach((item, index, arr) => {
                    filtered.push(item.value as string);
                    if (filtered.length === chunkLimit) {
                        chunks.push([...filtered]);
                        filtered = [];
                    }
                });
            if (filtered.length) {
                chunks.push([...filtered]);
                filtered = [];
            }

            const userOnSaleNft: any[] = [];
            for(let i = 0; i < chunks.length; i++) {
                // Грузим данные ассетов, которые на продаже
                const userNftOnSaleDetailsResponse = await getAssetDetails({
                    id: chunks[i]
                });

                userOnSaleNft.push(...userNftOnSaleDetailsResponse);
            }

            const userAuctionNft: any[] = [];
            for(let i = 0; i < auctionChunks.length; i++) {
                // Грузим данные ассетов, которые на аукционе
                const userNftOnSaleDetailsResponse = await getAssetDetails({
                    id: auctionChunks[i]
                });

                userAuctionNft.push(...userNftOnSaleDetailsResponse);
            }

            // фильтруем нфт только нашего выпускающего ск
            allUserNft = allUserNft.filter(item => item.issuer === CREATE_DAPP);

            // 3. Грузим даннные и формируем структуру для вывода на UI
            // Грузим все данные ск для формирования структуры
            const createDappDataResponse = await getAllAddressData(CREATE_DAPP, {
                matches: '(nft_|collection_)(.*)'
            });

            // Грузим данные из ск маркетплейса
            const marketDappData = await getAllAddressData(MARKET_DAPP, {
                matches: '(nft_|auction_)(.*)'
            });

            const wrappedOriginalIds: any = {};
            const getSignArtWrapperData = await getAllAddressData(SIGNART_WRAP_DAPP, {
                matches: '(.*)_assetId'
            });
            const ducksWrapperDappDataResult = await getAllAddressData(DUCK_WRAPP_DAPP, {
                matches: `(.*)_duckId`
            });

            const usdnPrices = await loadPrices();

            let regex = /signArtNft_|_assetId/ig;
            getSignArtWrapperData.forEach((item) => {
                wrappedOriginalIds[item.key.replace(regex, "")] = item.value;
            });

            // get ducks original id
            regex = /nft_|_duckId/ig;
            ducksWrapperDappDataResult.forEach((item) => {
                wrappedOriginalIds[item.key.replace(regex, "")] = item.value;
            });

            const resultArr: any = {};

            // формируем структуру нфт на продаже
            userOnSaleNft.forEach((item) => {
                resultArr[item.assetId] = item;
                //set likes
                if (wrappedOriginalIds[item.assetId]) {
                    resultArr[item.assetId].likes = marketDappData?.find((n) => {
                        return n.key === `nft_${wrappedOriginalIds[item.assetId]}_likes`;
                    })?.value || '';
                    resultArr[item.assetId].originalId = wrappedOriginalIds[item.assetId];
                }
            });

            userAuctionNft.forEach((item) => {
                resultArr[item.assetId] = item;
                //set likes
                if (wrappedOriginalIds[item.assetId]) {
                    resultArr[item.assetId].likes = marketDappData?.find((n) => {
                        return n.key === `nft_${wrappedOriginalIds[item.assetId]}_likes`;
                    })?.value || '';
                    resultArr[item.assetId].originalId = wrappedOriginalIds[item.assetId];
                }
                resultArr[item.assetId].isAuction = true;
            });

            marketDappData?.forEach((item) => {
                const [name, assetId, key] = item.key.split('_');
                if (name === 'nft') {
                    if (resultArr[assetId]) {
                        resultArr[assetId][key] = item.value;
                    }
                } else if (name === 'auction') {
                    if (resultArr[assetId] && item.value) {
                        resultArr[assetId].bids = (item.value as string).split(',').map((item) => {
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
                }
            });

            // формируем структуру нфт на продаже
            allUserNft.forEach((item) => {
                resultArr[item.assetId] = item;
            });

            createDappDataResponse?.forEach((item) => {
                const [name, assetId, key] = item.key.split('_');
                if (name === 'nft') {
                    if (resultArr[assetId]) {
                        if (key === 'issuer') {
                            resultArr[assetId].creator = item.value;
                        } else {
                            resultArr[assetId][key] = item.value;
                        }
                    }
                }
            });

            const result = Object.keys(resultArr).map(key => resultArr[key]);

            // decorate ducks
            /*const ducks = result.filter(item => item.isDuck);
            const genotypes: any = ducks.map((item) => {
                return {
                    assetId: item.originalId || item.assetId,
                    genotype: item.description.match(/DUCK-([A-Z]+-[A-Z]+)/)?.[1] as string
                }
            });

            const duckInfoResult = await this.rootStore.walletStore.getDuckInfo(genotypes);
            result.forEach((item) => {
                if (duckInfoResult?.[item.originalId || item.assetId]) {
                    const assetId = item.originalId || item.assetId;
                    item.characteristics = duckInfoResult[assetId].params;
                    item.achievements = duckInfoResult[assetId].achievements;
                }
            });*/

            // sort by date
            result.sort((a, b) => {
                if (a.issueTimestamp < b.issueTimestamp ) return 1;
                if (a.issueTimestamp > b.issueTimestamp) return -1;
                return 0;
            });

            return result;

        } catch (e) {
            // TODO: handle error
            console.error(e);
        }
    }

    return [];

}