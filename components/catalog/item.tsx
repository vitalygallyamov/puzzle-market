interface ICatalogItemParams {
    item: any;
}


/**
 * Catalog
 * @constructor
 * @param params
 */
 export default function CatalogItem(params: ICatalogItemParams) {
    return (
        <div>{params.item.assetId}</div>
    );
 }