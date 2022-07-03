import Card from 'components/catalog/card';
import styles from 'styles/components/catalog/Catalog.module.scss';
import {useState} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
interface ICatalogParams {
    items: any[];
}

/**
 * Catalog
 * @constructor
 * @param params
 */
 export default function Catalog(params: ICatalogParams) {
    const limit = 24;
    const [all, setAll] = useState([...params.items]);
    const [items, setItems] = useState(all.splice(0, limit));
    const [hasMore, setHasMore] = useState(!!all.length);

    const loadMore = async () => {
        setItems([...items, ...all.splice(0, limit)]);
        setAll(all);
        setHasMore(!!all.length);
    }
    return (
        <InfiniteScroll
            next={loadMore}
            hasMore={hasMore}
            loader={<div> Loading...</div>}
            dataLength={items.length}>
            <div className={styles.catalog}>
            {
                items.length ?
                    items.map((item) => <Card key={item.assetId} item={item}/>) : ''
            }
            </div>
        </InfiniteScroll>
    );
 }