import type {NextPage} from 'next'
import {ChangeEvent, useState, ReactElement} from 'react';

import Title from 'components/title';
import Button from 'components/button';

import Layout from 'components/layout'

import UploadIcon from 'assets/icons/upload.svg';
import CloseIcon from 'assets/icons/close.svg';

import type { NextPageWithLayout } from './_app'

import styles from 'styles/pages/Create.module.scss'
import Index from "./index";

interface ISourceInfo {
    originalFile: File,
    originalSize: string;
    originalUrl: string;
    compressedFile?: File;
    compressedSize?: string;
    compressedUrl?: string;
    compressPercent?: string;
}

const Create: NextPageWithLayout = () => {
    // const { accountStore, notificationStore } = useStores();

    const [creating, setCreating] = useState<boolean>(false);

    const [fileValue, setFileValue] = useState<string>('');
    const [source, setSource] = useState<File|null>();

    const [name, setName] = useState<string>('');
    const [collection, setCollection] = useState<string>('');
    const [description, setDescription] = useState<string>('');

    const [sourceMsg, setSourceMsg] = useState<string>();
    const [nameMsg, setNameMsg] = useState<string>();
    const [collectionMsg, setCollectionMsg] = useState<string>();

    const [sourceInfo, setSourceInfo] = useState<ISourceInfo|null>();

    const onChangeFile = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target?.files?.[0]) {
            const originalFile = e.target.files[0];
            setSource(originalFile);

            if (isAllowFileType(originalFile)) {
                setSourceInfo({
                    originalFile,
                    originalSize: (originalFile.size / 1024 / 1024).toFixed(2) + ' MB',
                    originalUrl: URL.createObjectURL(originalFile)
                });

                // compress image
                if (['image/gif', 'video/mp4'].indexOf(originalFile.type) === -1) {
                    /*new Compressor(originalFile, {
                        quality: 0.8,
                        maxWidth: 1960,
                        success(compressedFile) {
                            setSourceInfo({
                                originalFile,
                                originalSize: (originalFile.size / 1024 / 1024).toFixed(2) + ' MB',
                                originalUrl: URL.createObjectURL(originalFile),
                                compressedFile: compressedFile as File,
                                compressedSize: (compressedFile.size / 1024 / 1024).toFixed(2) + ' MB',
                                compressedUrl: URL.createObjectURL(compressedFile),
                                compressPercent: (100 - compressedFile.size / originalFile.size * 100).toFixed() + ' %'
                            });
                        }
                    });*/
                }
            }
        }
        if (e.target.value) {
            setFileValue(e.target.value);
        }
    }

    const isAllowFileType = (file: File) => {
        return ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'].indexOf(file.type) >= 0;
    }

    const onDeleteFile = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        e.stopPropagation();
        e.nativeEvent.stopPropagation();
        setSource(null);
        setFileValue('');
        setSourceInfo(null);
    }

    const onCreateNft = async () => {
        if (validate() && sourceInfo && source && name && collection) {
            /*const client = create({url: 'https://ipfs.infura.io:5001/api/v0'});

            const fileExtension = source.name.substring(source.name.lastIndexOf('\\') + 1).split('.')[1];

            let sourceUrl = 'https://ipfs.io/ipfs/';
            const ipfsFilePaths = [];
            let folderName = '';

            const addPaths = [{
                path: 'original.' + fileExtension.toLowerCase(),
                content: source
            }];

            if (sourceInfo?.compressedFile) {
                addPaths.push({
                    path: 'display.' + fileExtension.toLowerCase(),
                    content: sourceInfo?.compressedFile
                })
            }*/

            try {
                /*setCreating(true);
                for await (const result of client.addAll(addPaths, {cidVersion: 1, wrapWithDirectory: true})) {
                    if (result.path) {
                        ipfsFilePaths.push(result.path);
                    } else {
                        folderName = result.cid.toString()
                    }
                }

                let displayUrl = '';
                let originalUrl = '';

                ipfsFilePaths.forEach((fileName) => {
                    if (fileName.indexOf('display') >= 0) {
                        displayUrl = sourceUrl + folderName + '/' + fileName;
                    } else if (fileName.indexOf('original') >= 0) {
                        originalUrl = sourceUrl + folderName + '/' + fileName;
                    }
                });*/

                /*const txId = await accountStore.invoke({
                    dApp: MAINNET_CREATE_DAPP,
                    payment: [],
                    call: {
                        function: 'createNFT',
                        args: [
                            {type: 'string', value: name},
                            {type: 'string', value: description || ''},
                            {type: 'string', value: originalUrl},
                            {type: 'string', value: collection},
                            // {type: 'string', value: originalUrl}
                        ]
                    }
                });
                await waitForTx(txId as string, { apiBase: MAINNET_ADDRESS });
                if (txId) {
                    notificationStore.notify(`You created the NFT`, {
                        type: "success",
                        title: `Success`,
                        link: `/wallet`,
                        linkTitle: "View on Wallet",
                    });

                    //clear info
                    setSource(null);
                    setSourceInfo(null);
                    setFileValue('');
                    setName('');
                    setCollection('');
                    setDescription('');
                }*/
            } catch(e: any) {
                // console.error(e);
                /*notificationStore.notify(e.message ?? JSON.stringify(e), {
                    type: 'error',
                    title: 'Transaction is not completed'
                });*/
            } finally {
                setCreating(false);
            }
        }
    }

    const validate = (types?: string[]) => {
        let result = true;

        // validate source
        if (!types?.length || types.indexOf('source') >= 0) {
            if (!source) {
                setSourceMsg('Upload the file to mint it');
                result = result && false;
            } else if(!isAllowFileType(source)) {
                setSourceMsg('Invalid content type, valid: PNG, GIF, WEBP, JPEG, MP4');
                result = result && false;
            } else if(source.size > 1024 * 1024 * 10) {
                setSourceMsg('The maximum file size should be 10 MB');
                result = result && false;
            } else {
                setSourceMsg('');
            }
        }

        // validate name
        if (!types?.length || types.indexOf('name') >= 0) {
            if (!name) {
                setNameMsg('Write the item name');
                result = result && false;
            } else {
                setNameMsg('');
            }
        }

        // validate collection
        if (!types?.length || types.indexOf('collection') >= 0) {
            if (!collection) {
                setCollectionMsg('Write the collection name');
                result = result && false;
            } else {
                setCollectionMsg('');
            }
        }

        return result;
    }

    return (
        <div className={styles.content}>
            <Title title="Create a new item" />
            <div className={styles.wrapper}>
                <div className={styles.body}>
                    <div className={styles.block}>
                        <div className={styles.blockTitle}>Upload file</div>
                        <div className={styles.blockContent}>
                            <label
                                htmlFor="file-upload"
                                className={styles.uploadFileBlock + (sourceMsg ? ' ' + styles.uploadFileBlock_error : '')}>
                                <input id="file-upload" type="file" onChange={onChangeFile} value={fileValue} accept="image/*,video/mp4"/>
                                <div>
                                    <UploadIcon />
                                </div>
                                <div className={styles.uploadFile}>
                                    { source ? source.name : 'PNG, GIF, WEBP, JPEG, MP4 max 10 Mb' }&nbsp;
                                    { source ? <CloseIcon onClick={onDeleteFile}/> : '' }
                                </div>
                            </label>
                            {
                                sourceInfo ? <div className={styles.inputHint}>
                                    <div>
                                        <a href={sourceInfo.originalUrl} target="_blank">Original file ({sourceInfo.originalSize})</a>&nbsp;
                                        - Will be available for download
                                    </div>
                                    {
                                        sourceInfo.compressedFile ?
                                            <div>
                                                <a href={sourceInfo.compressedUrl}  target="_blank">Compressed file ({sourceInfo.compressedSize} ({sourceInfo.compressPercent})</a>&nbsp;
                                                - Will be displayed in the NFT card
                                            </div> : ''
                                    }
                                </div> : ''
                            }
                            {
                                sourceMsg ? <div className={styles.inputHint + ' ' + styles.inputHint_error}>{sourceMsg}</div> : ''
                            }
                        </div>
                    </div>

                    <div className={styles.block}>
                        <div className={styles.blockTitle}>Item details</div>
                        <div className={styles.blockContent}>
                            <div className={styles.inputBlock}>
                                <div className={styles.inputLabel}>Item name</div>
                                <input
                                    className={styles.input + (nameMsg ? ' ' + styles.input_error : '')}
                                    type="text"
                                    value={name}
                                    maxLength={16}
                                    onChange={(e) => {setName(e.target.value.replace(/[^a-zA-Z0-9-#№ ]/g, ""))}}/>
                                <div className={styles.inputHint}>Max 16 symbols. {name?.length} Left.</div>
                                {
                                    nameMsg ? <div className={styles.inputHint + ' ' + styles.inputHint_error}>{nameMsg}</div> : ''
                                }
                            </div>

                            <div className={styles.inputBlock}>
                                <div className={styles.inputLabel}>Collection name</div>
                                <input
                                    className={styles.input + (collectionMsg ? ' ' + styles.input_error : '')}
                                    type="text"
                                    value={collection}
                                    maxLength={60}
                                    onChange={(e) => {setCollection(e.target.value.replace(/[^a-zA-Z0-9- ]/g, ""))}}/>
                                <div className={styles.inputHint}>Max 60 symbols. {collection?.length} Left.</div>
                                {
                                    collectionMsg ? <div className={styles.inputHint + ' ' + styles.inputHint_error}>{collectionMsg}</div> : ''
                                }
                            </div>

                            <div className={styles.inputBlock}>
                                <div className={styles.inputLabel}>Description (Optional)</div>
                                <textarea
                                    className={styles.input}
                                    value={description}
                                    maxLength={1000}
                                    onChange={(e) => {setDescription(e.target.value)}}></textarea>
                                <div className={styles.inputHint}>Max 1000 symbols. {description?.length} Left.</div>
                            </div>
                        </div>
                    </div>
                    <Button caption="Create NFT" onClick={onCreateNft} disabled={creating} width='100%' />
                </div>
                <div className={styles.preview}>
                    <div className={styles.block}>
                        <div className={styles.blockTitle}>Preview</div>
                        <div className={styles.blockContent}>
                            {/*<MarketItem item={cardItem} />*/}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

Create.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            <Layout>{page}</Layout>
        </Layout>
    )
}

export default Create;