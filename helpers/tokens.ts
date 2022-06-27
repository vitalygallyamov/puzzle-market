export enum ASSET_ID {
    WAVES = 'WAVES',
    PUZZLE = 'HEB8Qaw9xrWpWs8tHsiATYGBWDBtP2S7kcPALrMu43AS',
    USDN = 'DG2xFkPdDwKUoBkzGAhQtLpSGzfXLiCYPEzeKH2Ad24p',
    EGG = 'C1iWsKGqLwjHUndiQ7iXpdmPum9PeCDFfyXBdJJosDRS',
}

export const tokenInfo: any = {
    WAVES: {
        id: ASSET_ID.WAVES,
        title: 'Waves',
        decimals: 100000000
    },
    HEB8Qaw9xrWpWs8tHsiATYGBWDBtP2S7kcPALrMu43AS: {
        id: ASSET_ID.PUZZLE,
        title: 'Puzzle',
        decimals: 100000000
    },
    DG2xFkPdDwKUoBkzGAhQtLpSGzfXLiCYPEzeKH2Ad24p: {
        id: ASSET_ID.USDN,
        title: 'USDN',
        decimals: 1000000
    },
    C1iWsKGqLwjHUndiQ7iXpdmPum9PeCDFfyXBdJJosDRS: {
        id: ASSET_ID.EGG,
        title: 'EGG',
        decimals: 100000000
    }
};