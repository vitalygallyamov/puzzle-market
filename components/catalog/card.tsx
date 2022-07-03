import {useState} from 'react';

import Image from 'next/image';
import Link from 'next/link';

import styles from 'styles/components/catalog/Card.module.scss';

interface ICatalogItemParams {
    item: any;
    inWallet?: boolean;
}


/**
 * Catalog
 * @constructor
 * @param params
 */
 export default function Card(params: ICatalogItemParams) {
     const [isLoad, setIsLoad] = useState<boolean>(false);
    const [isVideo, setIsVideo] = useState<boolean|null>(null);

    const [sourceLoad, setSourceLoad] = useState<boolean>(false);

    // useEffect(() => {
    //     axios.get(params.item.imageUrl).then((response) => {
    //         setSourceLoad(true);
    //         if (response.headers?.['content-type'] !== 'video/mp4') {
    //             setIsVideo(false);
    //         } else {
    //             setIsVideo(true);
    //         }
    //     });
    //
    //     return () => {
    //     }
    // }, [params.item.image]);

    let sellerImage = '';
    if (params.item.seller) {
        // sellerImage = identityImg.create(params.item.seller, {size: 120})
    }

    // const getButton = () => {
    //     let className = 'puzzle-nftMarketplace__button';
    //     let tooltip = '';
    //     const title = params.inWallet ?
    //         (params.item.isOnSell ? 'Cancel' : 'Sell') : 'Buy now';
    //
    //     if (params.inWallet && params.item.isOnSell) {
    //         className += ' puzzle-nftMarketplace__button_cancel';
    //         tooltip = 'Withdraw from sale';
    //     } else if (!params.inWallet && !params.item.isOnSell) {
    //         className += ' puzzle-nftMarketplace__button_disabled';
    //     }
    //
    //     const click = () => {
    //         return params.inWallet ?
    //             (params.item.isOnSell ? params.item.cancel(props?.cb) : null) : params.item.buy(props?.cb);
    //     }
    //     return params.inWallet && !params.item.isOnSell ?
    //         <Link to={params.item.marketLink}>
    //             <button
    //                 disabled={!params.inWallet && !params.item.isOnSell}
    //                 className={className} title={tooltip}>View</button></Link> :
    //         <button
    //             disabled={!params.inWallet && !params.item.isOnSell}
    //             className={className} title={tooltip} onClick={click}>{title}</button>
    // }

    // const marketButton = getButton();
    // const sendToGatewayButton = params.inWallet ?
    //     (<button className="puzzle-gateway__button" onClick={() => {params.item.sendToGatewayHandler()}}>Send to Ethereum</button>) :
    //     <div></div>;

    // const rightBlockContainer = params.inWallet && params.item.isOnSell ?
    //     <div className='puzzle-nftMarketplace-flyBlock puzzle-nftMarketplace-flyBlock_right'>
    //         <div className='puzzle-nftMarketplace-flyBlock__text'>On sale</div>
    //     </div> : '';

    let rarity;
    let breeding;
    let generation;
    if (params.item.isDuck && params.item.characteristics) {
        rarity = params.item.characteristics.find((item:any) => item.id === 'rarity');
        breeding = params.item.characteristics.find((item:any) => item.id === 'breeding');
        generation = params.item.characteristics.find((item:any) => item.id === 'generation');
    }
    return (
        <div className={styles.card}>
            <div className={styles.sourceWrap} style={{backgroundColor: params.item.bgColor}}>
                <div className={styles.image}>
                    <Image src={params.item.image} onLoad={() => {setIsLoad(true)}} layout='fill' placeholder={<div>12</div>}/>
                </div>
                {
                    params.item.isDuck && params.item.characteristics ?
                        <div className="puzzle-nftMarketplace-flyBlock puzzle-nftMarketplace-flyBlock_right" title={generation?.title}>
                            <div className="puzzle-nftMarketplace-flyBlock__text">{generation?.value}</div>
                        </div> : ''
                }
                {
                    params.item.isDuck && params.item.characteristics ?
                        <div className={styles.characteristics}>
                            <div className="puzzle-nftMarketplace-flyBlock puzzle-nftMarketplace-flyBlock_normal" title={rarity?.title}>
                                <div className="puzzle-nftMarketplace-flyBlock__text">{rarity?.value}</div>
                            </div>
                            <div
                                className={'puzzle-nftMarketplace-flyBlock puzzle-nftMarketplace-flyBlock_normal puzzle-nftMarketplace-flyBlock_' + (breeding?.value ? 'green' : 'red')}
                                title={breeding?.value ? 'Can breed' : 'Can\'t breed'}>
                                <div className="puzzle-nftMarketplace-flyBlock__text">{breeding?.value ? 'Fertile' : 'Sterile'}</div>
                            </div>
                        </div> : ''
                }
                { params.item.achievements?.length ?
                    <div className={styles.achievements}>
                        { params.item.achievements.map((item: any) => {
                            return <img key={item} src={`https://wavesducks.com/ducks/achievements/${item}.png`} />
                        }) }
                    </div>
                    : ''}
            </div>
            {
                /*params.item.sellerName ?
                    <Link
                        to={`/address/${params.item.seller}`}
                        title={params.item.seller}
                        className='puzzle-nftMarketplace-flyBlock'>
                        <img className="puzzle-nftMarketplace__accountIcon" src={sellerImage} alt={sellerImage} />
                        <div className='puzzle-nftMarketplace-flyBlock__text'>{params.item.sellerName}</div>
                    </Link> : ''*/
            }
            <div className={styles.info}>
                <div className={styles.collection}>
                    {
                        /*params.item.hasCollectionUrl ?
                            <Link to={params.item.collectionUrl}>{params.item.collectionName}</Link> :
                            params.item.collectionName*/
                    }
                </div>
                <Link href={params.item.marketLink || ''}>
                    <a className={styles.name}>{params.item.isDuck ? params.item.name.replace(/\s[0-9]+%/, "") : params.item.name}</a>
                </Link>
                {
                    // params.item.isAllowLikes ?
                    //     <div className="puzzle-nftMarketplace__likeBlock">
                    //         {
                    //             params.item.isUserLiked ? <UnLikeIcon /> : <LikeIcon onClick={() => { params.item.like(props?.cb) }}/>
                    //         }
                    //         {params.item.likeCount ? <div className="puzzle-nftMarketplace__likeCount">{params.item.likeCount}</div> : ''}
                    //     </div> : ''
                }
            </div>
            <div className={styles.actions}>
                {
                    params.item.isOnSell || !params.inWallet ?
                        <div className={styles.price}>
                            <div className={styles.priceCaption}>Price</div>
                            <div className={styles.asset}>
                                {/*{params.item.buyOutAssetId === ASSET_ID.PUZZLE ?*/}
                                {/*    <MiniPuzzleIcon style={{width: '20px', height: '20px'}} title="Puzzle"/> : ''}*/}
                                {/*{params.item.buyOutAssetId === ASSET_ID.USDN ?*/}
                                {/*    <UsdnIcon style={{width: '24px', height: '20px'}} title="USDN"/> : ''}*/}
                                {/*{params.item.buyOutAssetId === ASSET_ID.WAVES ?*/}
                                {/*    <WavesIcon style={{width: '18px', height: '18px'}} title="Waves"/> : ''}*/}
                                {/*{params.item.buyOutAssetId === ASSET_ID.EGG ?*/}
                                {/*    <EggIcon style={{width: '24px', height: '24px'}} title="Egg"/> : ''}*/}
                                &nbsp;
                                <span className={styles.priceValue}>{params.item.price}</span>
                                &nbsp;
                                {
                                    /*!params.item.isUsdnPrice && params.item.usdnPrice ?
                                        <NumberFormat
                                            value={params.item.usdnPrice}
                                            thousandSeparator={true}
                                            prefix={'~ $'}
                                            displayType='text'
                                            decimalScale={2}
                                            className='puzzle-nftMarketplace__priceUsdn'/> : ''*/
                                }
                            </div>
                            {/*<Link
                                className="puzzle-nftMarketplace__bidsLink"
                                to={`/auction/${params.item.assetId}`}>
                                {params.item.bidsInfo || ''}
                                {
                                    params.item.bidsInfo ?
                                        <NumberFormat
                                            value={params.item.bids[0].usdnPrice}
                                            thousandSeparator={true}
                                            prefix={' $'}
                                            decimalScale={2}
                                            displayType='text'/> : ''
                                }
                            </Link>*/}
                        </div> : <div></div>
                }
                <div>
                    {/*{marketButton}*/}
                </div>
            </div>
        </div>
    );
 }