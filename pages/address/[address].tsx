import {NextPage} from 'next';
import styles from 'styles/pages/Address.module.scss';
import Head from 'next/head';
// import Title from "../components/title";
// import Catalog from "../components/catalog/list";
import {getData} from 'data/address';
import {ReactElement} from "react";
import type { NextPageWithLayout } from '../_app'
import Header from "../../components/header";

interface IPageProps {
    data: any[];
    error?: string;
}

export async function getServerSideProps(context: any) {
    try {
        const data = await getData(context.params.address);

        return {
            props: {
                data: data || []
            }
        };
    } catch (e: any) {
        return {
            props: {
                data: [],
                error: e.toString()
            }
        };
    }
}

const Address: NextPageWithLayout<IPageProps> = ({data, error}) => {
    console.log(data, error);
    return (
        <div className={styles.container}>
            <Head>
                <title>Puzzle NFT Market</title>
                <meta name="description" content="Permissionless issue and trade NFTs" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.mainImage}>
                1
            </div>
        </div>
    )
}

Address.getLayout = function getLayout(page: ReactElement) {
    return (
        <>
            <Header />
            <>{page}</>
        </>
    )
}

export default Address