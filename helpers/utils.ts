import axios, { AxiosRequestConfig } from 'axios';
import {
    NODE
} from './addresses';

interface INftAsset {
    assetId: string;
    issuer: string;
    name: string;
    description: string;
}
export interface IAssetsNftResponse extends Array<INftAsset> {};

interface IAddressData {
    key: string;
    type: string;
    value: string|number;
}
export interface IAddressDataResponse extends Array<IAddressData> {};

interface IAssetPriceInfo {
    assets: {
        id: string;
        data: {
            'lastPrice_usd-n': number;
        }
    }[];
}

/**
 * Get all NFT from address
 * @param address Account address
 * @param limit 
 * @returns 
 */
export const getAllAddressNFT = async (address: string, limit: number = 1000) => {
    const result = await axios.get<IAssetsNftResponse>(`${NODE}/assets/nft/${address}/limit/${limit}`);
    return result.data;
}

/**
 * Get all data from address
 * @param address Account address
 * @param params 
 * @returns 
 */
export const getAllAddressData = async (address: string, params: AxiosRequestConfig<{matches?: string}> = {}) => {
    const result = await axios.get<IAddressDataResponse>(`${NODE}/addresses/data/${address}`, params);
    return result.data;
}

/**
 * Load assets price in USDN
 * @returns 
 */
export const loadPrices = async () => {
    const response = await axios.get<IAssetPriceInfo>('https://wavescap.com/api/assets-info.php', {
        params: {
            assetIds: [
                'WAVES',
                'HEB8Qaw9xrWpWs8tHsiATYGBWDBtP2S7kcPALrMu43AS', // Puzzle
                'C1iWsKGqLwjHUndiQ7iXpdmPum9PeCDFfyXBdJJosDRS' // EGG
            ],
            attributes: ['id', 'data']
        }
    });

    const result: {[x:string]: number} = {};
    response.data.assets?.forEach((asset) => {
        result[asset.id] = asset.data['lastPrice_usd-n'] || 0;
    });

    return result;
}