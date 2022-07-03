import type { NextPage } from 'next';
import Head from 'next/head';

import Title from 'components/title';
import Catalog from 'components/catalog/list';

import Layout from 'components/layout'

import styles from 'styles/pages/Index.module.scss';
import InfiniteScroll from "react-infinite-scroll-component";
import {ReactElement, useState} from "react";
import axios from "axios";

import type { NextPageWithLayout } from './_app'

import {getData} from 'data/catalog';


interface IPageProps {
  data: any[];
  error?: string;
}

export async function getStaticProps({req}: any) {
    try {
        const data = await getData();

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

const Index: NextPageWithLayout<IPageProps> = ({data, error}) => {

  return (
    <div className={styles.container}>
      <Head>
        <title>Puzzle NFT Market</title>
        <meta name="description" content="Permissionless issue and trade NFTs" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Title title="Explore Puzzle Market" />
      <div className={styles.description}>Puzzle Market is place where you can create, buy and sell NFTs</div>
        <Catalog items={data} />
    </div>
  )
}

Index.getLayout = function getLayout(page: ReactElement) {
    return (
        <Layout>
            <Layout>{page}</Layout>
        </Layout>
    )
}

export default Index
