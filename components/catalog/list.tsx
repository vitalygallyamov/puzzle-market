import CatalogItem from 'components/catalog/item';
import styles from 'styles/Layout.module.scss';
interface ICatalogParams {
    items: any[];
}

/**
 * Catalog
 * @constructor
 * @param params
 */
 export default function Catalog(params: ICatalogParams) {
    return (
        <div className={styles.catalog}>
                {
                    params.items.length ?
                        params.items.map((item) => <CatalogItem key={item.assetId} item={item}/>) : ''
                }
            </div>
    );
 }